import { IsEmail, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Book } from '../../entities';

export interface BookQuery {
    title?: string;
    authorId?: string;
    skip?: number;
    limit?: number;
    sortBy?: 'title' | 'createdAt' | 'updatedAt';
    orderBy?: 1 | -1;
}

type BookEditable = Omit<Book, 'id' | 'uuid' | 'author' | 'createdAt' | 'updatedAt'>;

@InputType()
export class BookInput implements BookEditable {
    
    @Field()
    title: string;

    @Field()
    price: number;

    @Field()
    authorId: string;
}

@InputType()
export class BookInputPartial implements BookEditable {
    @Field({ nullable: true })
    title: string;

    @Field({ nullable: true })
    price: number;

    @Field({ nullable: true })
    authorId: string;
}

@InputType()
export class BookQueryInput implements BookQuery {
    @Field({ nullable: true })
    title: string;

    @Field({ nullable: true })
    authorId: string;

    @Field({ nullable: true, defaultValue: 0 })
    skip: number;

    @Field({ nullable: true, defaultValue: 5 })
    limit: number;

    @Field({ nullable: true, defaultValue: -1, })
    orderBy: 1 | -1;

    @Field({ nullable: true, defaultValue: 'updatedAt' })
    sortBy: 'title' | 'createdAt' | 'updatedAt';
}
