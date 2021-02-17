import { Request, Response, NextFunction } from 'express';
import { IRequest, Pipeline } from '../../../types';
import to from 'await-to-js';
import { ApiSuccess, BadRequest, GeneralError, logErrorObject, logger, NotFound } from '../../../utils';
import { IUserQuery } from '../../../validators';
import { User } from '../../../entity';
import { getRepository, getMongoRepository } from 'typeorm';

const GENERAL_ERROR_REGISTER = 'Unexpected error when registering user';
const GENERAL_ERROR_UPDATE = 'Unexpected error when updating user';
const GENERIC_ERROR_MESSAGE_FETCH = 'Unexpected error when fetching users';
const GENERAL_ERROR_DELETE = 'Unexpected error when removing user';

export const registerUser = async (req: IRequest<User>, res: Response, next: NextFunction): Promise<void> => {
    let error, user;
    const { firstName, lastName, age, email } = req.body;

    const userRepository = getRepository(User);

    [error, user] = await to(userRepository.findOne({ email: String(email) }));
    if (error) {
        logErrorObject(error, 'Error when fetching user');
        return next(new GeneralError(GENERAL_ERROR_REGISTER));
    }
    if (user) {
        logger.warn(`User of email ${email} already exists`);
        return next(new BadRequest(`User of email ${email} already exists`));
    }

    const userObj: Omit<User, 'id'> = {
        firstName,
        lastName,
        age,
        email
    };
    const newUser = userRepository.create(userObj);


    [error, user] = await to(userRepository.save(newUser));
    if (error) {
        logErrorObject(error, 'Error when saving user');
        return next(new GeneralError(GENERAL_ERROR_REGISTER));
    }

    logger.info(`User of name ${firstName} registered`);
    const response = JSON.parse(JSON.stringify(user));

    return next(new ApiSuccess(`User of name ${firstName} registered`, response));
}

export const updateUser = async (req: IRequest<User>, res: Response, next: NextFunction): Promise<void> => {
    let error, user: User, userCheck;
    const { firstName, lastName, age, email } = req.body;
    const { id } = req.params;

    if (!id) {
        logger.warn('No id in request');
        return next(new BadRequest('No user id in request'));
    }

    const userRepository = getRepository(User);

    [error, user] = await to<User>(userRepository.findOne(id));
    if (error) {
        logErrorObject(error, 'Error when fetching user');
        return next(new GeneralError(GENERAL_ERROR_UPDATE));
    }
    if (!user) {
        logger.warn(`User of id ${id} does not exist`);
        return next(new BadRequest(`User of id ${id} does not exist`));
    }

    if (email) {
        [error, userCheck] = await to(userRepository.findOne({ email: String(email) }));
        if (error) {
            logErrorObject(error, 'Error when fetching user');
            return next(new GeneralError(GENERAL_ERROR_UPDATE));
        }
        if (userCheck) {
            logger.warn(`User of email ${email} already exists`);
            return next(new BadRequest(`User of email ${email} already exists`));
        }

        user.email = email;
    }

    firstName && (user.firstName = firstName);
    lastName && (user.lastName = lastName);
    age && (user.age = age);

    [error] = await to(userRepository.save(user));
    if (error) {
        logErrorObject(error, 'Error when saving user');
        return next(new GeneralError(GENERAL_ERROR_UPDATE));
    }

    logger.info(`User of name ${user.firstName} updated`);
    const response = JSON.parse(JSON.stringify(user));

    return next(new ApiSuccess(`User of name ${user.firstName} updated`, response));
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let error, user: User;

    const { id } = req.params;

    if (!id) {
        logger.warn('No id in request');
        return next(new BadRequest('No user id in request'));
    }

    const userRepository = getRepository(User);

    [error, user] = await to<User>(userRepository.findOne(id));
    if (error) {
        logErrorObject(error, 'Error when fetching user');
        return next(new GeneralError(GENERAL_ERROR_DELETE));
    }
    if (!user) {
        logger.warn(`User of id ${id} does not exist`);
        return next(new BadRequest(`User of id ${id} does not exist`));
    }

    [error] = await to(userRepository.remove(user));
    if (error) {
        logErrorObject(error, 'Error when deleting user');
        return next(new GeneralError(GENERAL_ERROR_DELETE));
    }

    logger.info(`User of id ${id} removed`);

    return next(new ApiSuccess(`User of id ${id} removed`, {}));
}

export const fetchUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    if (!id) {
        logger.warn('No id in request');
        return next(new BadRequest('No user id in request'));
    }

    const userRepository = getMongoRepository(User);
    const [error, user] = await to<User>(userRepository.findOne(id));
    if (error) {
        logErrorObject(error, 'Error in fetching users');
        return next(new GeneralError(GENERIC_ERROR_MESSAGE_FETCH));
    }

    if (!user) {
        logger.warn(`User of id ${id} does not exist`);
        return next(new NotFound(`User of id ${id} does not exist`));
    }

    logger.info('Found user');
    return next(new ApiSuccess('Found user', user));
}

export const fetchUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const query = req.query as IUserQuery;
    const pipeline = buildPipeline(query);
    const userRepository = getMongoRepository(User);
    const [error, users] = await to<Array<User>>(userRepository.aggregate(pipeline).toArray());
    if (error) {
        logErrorObject(error, 'Error in fetching users');
        return next(new GeneralError(GENERIC_ERROR_MESSAGE_FETCH));
    }
    if (users) {
        logger.info(`Found ${users.length} users`);
        return next(new ApiSuccess(`Found ${users.length} users`, users));
    }
}

const buildPipeline = (queryParams: IUserQuery): Array<Pipeline> => {
    const pipeline: Array<Pipeline> = [];
    const limit = queryParams.limit;
    const skip = queryParams.skip;
    const sort = {
        [queryParams.sortBy as string]: queryParams.orderBy
    };

    const match = {};
    Object.assign(
        match,
        queryParams.firstName && { firstName: { $regex: `${String(queryParams.firstName)}`, $options: 'i' } },
        queryParams.lastName && { lastName: { $regex: `${String(queryParams.lastName)}`, $options: 'i' } },
        queryParams.email && { email: { $regex: `${String(queryParams.email)}`, $options: 'i' } }
    );

    const projection = {
        _id: 0,
        __v: 0
    };

    pipeline.push({ $match: match });
    pipeline.push({ $sort: sort });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });
    pipeline.push({ $project: projection });

    return pipeline;
};
