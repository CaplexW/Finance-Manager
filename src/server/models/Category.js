import { Schema, model } from "mongoose";

const schema = {
  name: { type: String, required: true },
  color: { type: String, required: true },
  type: { type: String, enum: ['income', 'outcome'], required: true },
};

const category = new Schema(schema, { timestamps: true });

export default model('User', category);