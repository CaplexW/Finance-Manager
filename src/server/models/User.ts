import { Schema, Types, model } from "mongoose";

const schema = {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    currentBalance: { type: Number, required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    accounts: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
    goals: [{ type: Schema.Types.ObjectId, ref: 'Goal' }],
    operations: [{ type: Schema.Types.ObjectId, ref: 'Operation' }],
    image: String,
};

const user = new Schema(schema, { timestamps: true });
const User = model('User', user);

export default User;

export interface IUser {
    _id?: Types.ObjectId | string,
    email: string,
    password: string,
    name: string,
    currentBalance: number,
    categories: Types.ObjectId[],
    accounts: Types.ObjectId[],
    image: string,
}
