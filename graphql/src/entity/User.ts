import { Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm';
import { ObjectType, Field, ID} from 'type-graphql';

@ObjectType()
@Entity()
export default class User {

    @Field(type => ID)
    @ObjectIdColumn()
    id: ObjectID;

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
    @Column()
    email: string;
}
