import { Schema, model, Types, HydratedDocument } from "mongoose";

const schema = {
  name: { type: String, required: true },
  color: { type: String, required: true },
  isIncome: { type: Boolean, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  icon: { type: Schema.Types.ObjectId, ref: 'Icon', required: true },
};

const category = new Schema(schema);
const Category = model('Category', category);

export default Category;

export interface ICategory {
  name: string,
  color: string,
  isIncome: boolean,
  icon: Types.ObjectId,
  user: Types.ObjectId,
}
export type TCategory = {
  name: string,
  color: string,
  isIncome: boolean,
  icon: Types.ObjectId,
  user: Types.ObjectId,
};

export type CategoryDocument = HydratedDocument<{
  name: string;
  color: string;
  isIncome: boolean;
  user: Types.ObjectId;
  icon: Types.ObjectId;
}>;
