import { IsEmail, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { User } from '../../entities';

export interface UserQuery {
    firstName?: string;
    lastName?: string;
    email?: string;
    skip?: number;
    limit?: number;
    sortBy?: 'firstName' | 'email' | 'createdAt' | 'updatedAt';
    orderBy?: 1 | -1;
}

type UserEditable = Omit<User, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>;

@InputType()
export class UserInput implements UserEditable {
    
    @Field()
    firstName: string;

    @Field()
    @MaxLength(24)
    lastName: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    age: number;
}

@InputType()
export class UserInputPartial implements UserEditable {
    @Field({ nullable: true })
    firstName: string;

    @Field({ nullable: true })
    lastName: string;

    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true })
    age: number;
}

@InputType()
export class UserQueryInput implements UserQuery {
    @Field({ nullable: true })
    firstName: string;

    @Field({ nullable: true })
    lastName: string;

    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true, defaultValue: 0 })
    skip: number;

    @Field({ nullable: true, defaultValue: 5 })
    limit: number;

    @Field({ nullable: true, defaultValue: -1, })
    orderBy: 1 | -1;

    @Field({ nullable: true, defaultValue: 'updatedAt' })
    sortBy: 'firstName' | 'email' | 'createdAt' | 'updatedAt';
}
