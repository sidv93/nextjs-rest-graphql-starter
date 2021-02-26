import { Entity, ObjectIdColumn, ObjectID, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, RelationId, PrimaryColumn } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { User } from '.';

@ObjectType()
@Entity()
export default class Book {

    @Field(type => ID)
    @ObjectIdColumn({ generated: true })
    id: ObjectID;

    @Field()
    @Column()
    uuid: string;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    price: number;

    @Field(type => User)
    @ManyToOne(type => User)
    author: User;

    @Field()
    @Column()
    authorId: string;

    @Field()
    @CreateDateColumn({
        nullable: false,
        name: 'createdAt'
    })
    createdAt: Date;

    @Field()
    @UpdateDateColumn({
        nullable: false,
        name: 'updatedAt'
    })
    updatedAt: Date;
}
