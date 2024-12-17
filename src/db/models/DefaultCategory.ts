import { Schema, model, Types } from "mongoose";

const schema = {
  name: { type: String, required: true },
  color: { type: String, required: true },
  iconName: { type: String, required: true },
  isIncome: { type: Boolean, required: true },
  icon: { type: Schema.Types.ObjectId, ref: 'Icon' },
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
