import { Request, Response, NextFunction } from 'express';
// import { IUser, User, UserDoc } from '../../../models';
import { IRequest, Pipeline } from '../../../types';
import to from 'await-to-js';
import { ApiSuccess, BadRequest, GeneralError, logErrorObject, logger } from '../../../utils';
import { IUserQuery } from '../../../validators';
import { User } from '../../../entity';
import { getRepository, ObjectID } from 'typeorm';

const GENERAL_ERROR_REGISTER = 'Unexpected error when registering user';
const GENERAL_ERROR_UPDATE = 'Unexpected error when updating user';
const GENERIC_ERROR_MESSAGE_FETCH = 'Unexpected error when fetching users';

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

export const fetchUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // const query = req.query as IUserQuery;
    // const pipeline = buildPipeline(query);
    // const [error, users] = await to<Array<UserDoc>>(User.aggregate(pipeline).exec());
    // if (error) {
    //     logErrorObject(error, 'Error in fetching users');
    //     return next(new GeneralError(GENERIC_ERROR_MESSAGE_FETCH));
    // }
    // if (users) {
    //     logger.info(`Found ${users.length} users`);
    //     return next(new ApiSuccess(`Found ${users.length} users`, users));
    // }
}

const buildPipeline = (queryParams: IUserQuery): Array<Pipeline> => {
    const pipeline: Array<Pipeline> = [];
    // const limit = queryParams.limit;
    // const skip = queryParams.skip;
    // const sort = {
    //     [queryParams.sortBy as string]: queryParams.orderBy
    // };

    // const match = {};
    // Object.assign(
    //     match,
    //     queryParams.name && { name: { $regex: `${String(queryParams.name)}`, $options: 'i' } },
    //     queryParams.id && { id: String(queryParams.id) },
    //     queryParams.email && { email: { $regex: `${String(queryParams.email)}`, $options: 'i' } }
    // );

    // const projection = {
    //     _id: 0,
    //     __v: 0
    // };

    // pipeline.push({ $match: match });
    // pipeline.push({ $sort: sort });
    // pipeline.push({ $skip: skip });
    // pipeline.push({ $limit: limit });
    // pipeline.push({ $project: projection });

    return pipeline;
};
