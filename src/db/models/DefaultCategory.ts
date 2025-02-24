import { Schema, model, Types, Document, HydratedDocument } from "mongoose";

const schema = {
  name: { type: String, required: true },
  color: { type: String, required: true },
  iconName: { type: String, required: true },
  isIncome: { type: Boolean, required: true },
  icon: { type: Schema.Types.ObjectId, ref: 'Icon', default: null },
};

const defaultCategory = new Schema(schema);
const DefaultCategory = model('DefaultCategory', defaultCategory);

export default DefaultCategory;

export type TDefaultCategory = {
  name: string,
  color: string,
  iconName: string,
  isIncome: boolean,
  icon: Types.ObjectId | null,
};

export type DefaultCategoryDoument = HydratedDocument <{
  name: string,
  color: string,
  iconName: string,
  isIncome: boolean,
  icon: Types.ObjectId | null,
}>;
