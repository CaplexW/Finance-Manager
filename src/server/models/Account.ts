import { Schema, Types, model } from "mongoose";

const schema = {
    name: { type: String, required: true },
    type: { type: String, enum: ['savings', 'credit', 'deposit', 'debit'], required: true },
    currentBalance: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    goal: { type: Schema.Types.ObjectId, ref: 'Goal' },
    percent: Number,
    image: String,
};

const account = new Schema(schema, { timestamps: true });
const Account = model('Account', account);

export default Account;

export interface IAccount {
    name: string,
    type: string,
    currentBalance: 0,
    user: Types.ObjectId,
    percent?: number,
    goal?: string,
};