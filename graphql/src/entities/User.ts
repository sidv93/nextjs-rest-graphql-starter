import { Entity, ObjectIdColumn, ObjectID, Column, CreateDateColumn, UpdateDateColumn, Generated } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
@Entity()
export default class User {

    @Field(type => ID)
    @ObjectIdColumn({ generated: true })
    id: ObjectID;

    @Field()
    @Column({ unique: true })
    uuid: string;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Field()
    @Column()
    age: number;

    @Field()
    @Column({ unique: true })
    email: string;

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
