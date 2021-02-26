import { ValidationError } from 'apollo-server-express';
import to from 'await-to-js';
import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { ObjectID } from 'mongodb';

import { User } from '../../entities';
import { logErrorObject, logger } from '../../utils';
import { Pipeline } from '../../utils/types';
import { UserQueryInput, UserQuery, UserInputPartial, UserInput } from './inputs';

@Resolver(of => User)
export default class UserResolver {
    private userRepository: MongoRepository<User>;
    constructor() {
        this.userRepository = getMongoRepository(User);
    }

    @Query(returns => User, { nullable: true })
    async user(@Arg('id', type => String) id: string): Promise<User> {
        const [error, user] = await to<User>(this.userRepository.findOne({ uuid: id }));
        if (error) {
            logErrorObject(error, 'Error in fetching user');
            throw new Error('Error in finding user');
        }
        if (!user) {
            logger.warn(`No user found for id ${id}`);
            throw new ValidationError(`No user found for id ${id}`);
        }
        return user;
    }

    @Query(returns => [User])
    async users(@Arg('userQuery') userQuery: UserQueryInput): Promise<User[]> {
        const pipeline = this.buildPipeline(userQuery);
        const [error, users] = await to<Array<User>>(this.userRepository.aggregate(pipeline).toArray());
        if (error) {
            logErrorObject(error, 'Error in fetching users');
            throw new Error('Error in fetching users');
        }
        if (users) {
            logger.info(`Found ${users.length} users`);
            return users;
        }
    }

    @Mutation(returns => User)
    async addUser(
        @Arg('user') userInput: UserInput
    ): Promise<User> {
        let error, user;
        const { email, firstName } = userInput;
        [error, user] = await to<User>(this.userRepository.findOne({ email }));
        if (error) {
            logErrorObject(error, 'Error in fetching user');
            throw new Error('Error in adding user');
        }
        if (user) {
            logger.warn(`User of email ${email} already exists`);
            throw new ValidationError(`User of email ${email} already exists`);
        }
        const newUser = this.userRepository.create({ uuid: uuid(), ...userInput });
        [error, user] = await to<User>(this.userRepository.save(newUser));
        if (error) {
            logErrorObject(error, 'Error in saving user');
            throw new Error('Error in adding user');
        }
        logger.info(`User of name ${firstName} added`);
        console.log('new user', user);
        return user;
    }

    @Mutation(returns => User)
    async updateUser(@Arg('id', type => String) id: string, @Arg('user') userInput: UserInputPartial): Promise<User> {
        let error, user, userCheck;
        const { email, firstName, lastName, age } = userInput;
        [error, user] = await to<User>(this.userRepository.findOne({ uuid: id }));
        if (error) {
            logErrorObject(error, 'Error in fetching user');
            throw new Error('Error in updating user');
        }
        if (!user) {
            logger.warn(`User of id ${id} does not exist`);
            throw new ValidationError(`User of id ${id} does not exist`);
        }
        if (email) {
            [error, userCheck] = await to<User>(this.userRepository.findOne({ email }));
            if (error) {
                logErrorObject(error, 'Error in fetching user');
                throw new Error('Error in updating user');
            }
            if (userCheck) {
                logger.warn(`User of email ${email} already exists`);
                throw new ValidationError(`User of email ${email} already exists`);
            }
            user.email = email;
        }
        age && (user.age = age);
        firstName && (user.firstName = firstName);
        lastName && (user.lastName = lastName);

        [error, userCheck] = await to<User>(this.userRepository.save(user));
        if (error) {
            logErrorObject(error, 'Error in saving user');
            throw new Error('Error in updating user');
        }
        logger.info(`User of id ${id} updated`);

        return userCheck;
    }

    @Mutation(returns => String)
    async deleteUser(@Arg('id', type => String) id: string): Promise<string> {
        let error, user;
        [error, user] = await to<User>(this.userRepository.findOne({ uuid: id }));
        if (error) {
            logErrorObject(error, 'Error when fetching user');
            throw new Error('Error in deleting user');
        }
        if (!user) {
            logger.warn(`User of id ${id} does not exist`);
            throw new ValidationError(`User of id ${id} does not exist`);
        }

        [error] = await to(this.userRepository.remove(user));
        if (error) {
            logErrorObject(error, 'Error when deleting user');
            throw new Error('Error in deleting user');
        }

        logger.info(`User of id ${id} removed`);

        return id;
    }

    private buildPipeline = (query: UserQuery): Array<Pipeline> => {
        const pipeline: Array<Pipeline> = [];
        const limit = query.limit;
        const skip = query.skip;
        const sort = {
            [query.sortBy as string]: query.orderBy
        };

        const match = {};
        Object.assign(
            match,
            query.firstName && { firstName: { $regex: `${String(query.firstName)}`, $options: 'i' } },
            query.lastName && { lastName: { $regex: `${String(query.lastName)}`, $options: 'i' } },
            query.email && { email: { $regex: `${String(query.email)}`, $options: 'i' } }
        );

        const projection = {
            // _id: 0,
            __v: 0
        };

        pipeline.push({ $match: match });
        pipeline.push({ $sort: sort });
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });
        pipeline.push({ $project: projection });

        return pipeline;
    }
}
