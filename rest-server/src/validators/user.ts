import { number, object, ObjectSchema, string } from 'yup';
import { IUser } from '../models';

export const UserSchema: ObjectSchema<Omit<IUser, 'id'>> = object({
    name: string().required('Name is required'),
    email: string().email().typeError('Invalid email').required('Email is required')
}).defined();

export interface IUserQuery {
    id?: string;
    name?: string;
    email?: string;
    skip?: number;
    limit?: number;
    sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt';
    orderBy?: 1 | -1;
}

export const UserQuerySchema: ObjectSchema<IUserQuery> = object({
    name: string().notRequired(),
    email: string().email().typeError('Not a valid email').notRequired(),
    search: string().notRequired(),
    skip: number().moreThan(-1).default(0).notRequired(),
    limit: number().positive().default(20).notRequired(),
    sortBy: string().oneOf(['name', 'email', 'createdAt', 'updatedAt'], 'Not a valid sort value').default('updatedAt').notRequired(),
    orderBy: number().oneOf([1, -1], 'Not a valid').default(-1).notRequired()
}).defined();

export const UserEditSchema: ObjectSchema<Partial<IUser>> = object({
    name: string().notRequired(),
    email: string().email().typeError('Invalid email').notRequired()
}).defined();
