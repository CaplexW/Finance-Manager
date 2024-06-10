import { Schema, model } from "mongoose";

const schema = {
  date: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  balanceBefore: Number,
  balanceAfter: Number,
  categorty: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
};

const operation = new Schema(schema, { timestamps: true });
const Operation = model('Operation', operation);

export default Operation;
