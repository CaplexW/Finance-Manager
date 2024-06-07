import { Schema, model } from "mongoose";

const schema = {
    name: { type: String, required: true },
    type: { type: String, enum: ['savings', 'credit'], required: true },
    currentBalance: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    goal: [{ type: Schema.Types.ObjectId, ref: 'Goal' }],
    image: String,
};

const account = new Schema(schema, { timestamps: true });

export default model('Account', account);