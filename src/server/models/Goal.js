import { Schema, model } from "mongoose";

const schema = {
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['complete', 'in progress', 'abandoned']},
};

const goal = new Schema(schema, { timestamps: true });

export default model('User', goal);