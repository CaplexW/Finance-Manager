import { Schema, model } from "mongoose";

const schema = {
  date: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  balanceBefore: Number,
  balanceAfter: Number,
  categorty: { type: Schema.Types.ObjectId, ref: 'Category' },
};

const operation = new Schema(schema, { timestamps: true });

export default model('User', operation);