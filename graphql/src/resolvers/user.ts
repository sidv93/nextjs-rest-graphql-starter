import { ValidationError } from 'apollo-server-express';
import to from 'await-to-js';
import { Resolver, Query, Arg, Mutation, InputType, Field } from 'type-graphql';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';

import { User } from '../entities';
import { logErrorObject, logger } from '../utils';

@InputType()
export class UserInput implements Omit<User, 'id'> {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field()
    age: number;
}

@InputType()
export class UserInputPartial implements Omit<User, 'id'> {
    @Field({ nullable: true })
    firstName: string;

    @Field({ nullable: true })
    lastName: string;

    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true })
    age: number;
}

@Resolver(of => User)
export default class UserResolver {
    private userRepository: MongoRepository<User>;
    constructor() {
        this.userRepository = getMongoRepository(User);
    }

    @Query(returns => User, { nullable: true })
    async user(@Arg('id', type => String) id: string): Promise<User> {
        const [error, user] = await to<User>(this.userRepository.findOne(new ObjectID(id)));
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
    users(): Promise<User[]> {
        return this.userRepository.find();
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
        const newUser = this.userRepository.create(userInput);
        [error, user] = await to<User>(this.userRepository.save(newUser));
        if (error) {
            logErrorObject(error, 'Error in saving user');
            throw new Error('Error in adding user');
        }
        logger.info(`User of name ${firstName} added`);
        return user;
    }

    @Mutation(returns => User)
    async updateUser(@Arg('id', type => String) id: string, @Arg('user') userInput: UserInputPartial): Promise<User> {
        let error, user, userCheck;
        const { email, firstName, lastName, age } = userInput;
        [error, user] = await to<User>(this.userRepository.findOne(new ObjectID(id)));
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
    async deleteUser(@Arg('id', type => String) userId: string): Promise<string> {
        let error, user;
        [error, user] = await to<User>(this.userRepository.findOne(new ObjectID(userId)));
        if (error) {
            logErrorObject(error, 'Error when fetching user');
            throw new Error('Error in deleting user');
        }
        if (!user) {
            logger.warn(`User of id ${userId} does not exist`);
            throw new ValidationError(`User of id ${userId} does not exist`);
        }

        [error] = await to(this.userRepository.remove(user));
        if (error) {
            logErrorObject(error, 'Error when deleting user');
            throw new Error('Error in deleting user');
        }

        logger.info(`User of id ${userId} removed`);
        
        return userId;
    }
}
