import { Document, Model, Schema, model } from 'mongoose';

export interface IUser {
    id: string;
    name: string;
    email: string;
}

export type UserDoc = IUser & Document;
type UserModel = Model<UserDoc>;

const schema = new Schema<IUser>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

}, { id: false, strict: 'throw', timestamps: true });

export const User: UserModel = model<UserDoc, UserModel>('User', schema);
