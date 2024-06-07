import { Schema, model, Types } from "mongoose";
import { ReactElement } from "react";

const schema = {
  name: { type: String, required: true },
  color: { type: String, required: true },
  type: { type: String, enum: ['income', 'outcome'], required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
};

const category = new Schema(schema);

export default model('Category', category);

export interface ICategory {
  name: string,
  color: string,
  type: string,
  icon: ReactElement,
  user: Types.ObjectId,
}