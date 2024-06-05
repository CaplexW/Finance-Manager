import { Schema, model } from "mongoose";

const schema = {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    currentBalance: { type: Number, required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    accounts: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
    image: String,
};

const user = new Schema(schema, { timestamps: true });

export default model('User', user);