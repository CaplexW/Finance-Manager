import { Schema, model } from "mongoose";

const schema = {
  name: { type: String, required: true },
  color: { type: String, required: true },
  isIncome: { type: String, required: true },
};

const category = new Schema(schema, { timestamps: true });

export default model('User', category);