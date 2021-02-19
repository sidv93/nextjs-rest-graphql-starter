import { Resolver, Query, Arg, Mutation, InputType, Field } from 'type-graphql';
import { getRepository, Repository } from 'typeorm';

import { User } from '../entity';

@InputType()
export class UserInput implements Partial<User> {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field()
    age: number;
}

@Resolver(of => User)
export default class UserResolver {
    private userRepository: Repository<User>;
    constructor() {
        this.userRepository = getRepository(User);
    }

    @Query(returns => User, { nullable: true })
    user(@Arg('id', type => String) id: string) {
        return this.userRepository.findOne(id);
    }

    @Query(returns => [User])
    users(): Promise<User[]> {
        return this.userRepository.find();
    }

    @Mutation(returns => User)
    async addUser(
        @Arg('user') userInput: UserInput
    ): Promise<User> {
        const user = this.userRepository.create(userInput);
        return await this.userRepository.save(user);
    }
}
