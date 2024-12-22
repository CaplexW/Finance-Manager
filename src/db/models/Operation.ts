import { Schema, Types, model } from "mongoose";

export interface IOperation {
  date: string,
  name: string,
  amount: number,
  balanceBefore?: number
  balanceAfter?: number,
  category: Types.ObjectId,
  user: Types.ObjectId,
}

const schema = {
  date: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  balanceBefore: Number,
  balanceAfter: Number,
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
};

const operation = new Schema(schema, { timestamps: true });
const Operation = model('Operation', operation);



export default Operation;
