import { HydratedDocument, Schema, Types, model } from "mongoose";

export interface IOperation {
  date: string,
  time?: string,
  name: string,
  amount: number,
  balanceBefore?: number
  balanceAfter?: number,
  category: Types.ObjectId,
  user: Types.ObjectId,
  createdAt: Date,
  updatedAt: Date,
}

const schema = {
  date: { type: String, required: true },
  time: String,
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  balanceBefore: Number,
  balanceAfter: Number,
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
};

const operation = new Schema(schema, { timestamps: true });
const Operation = model('Operation', operation);

export type OperationDocument = HydratedDocument<{
  date: string,
  time?: string | null,
  name: string,
  amount: number,
  balanceBefore?: number | null,
  balanceAfter?: number | null,
  category: Types.ObjectId,
  user: Types.ObjectId,
  createdAt: Date,
  updatedAt: Date,
}>;

export default Operation;
