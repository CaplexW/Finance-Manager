import { Schema, model } from "mongoose";
import { ReactElement } from "react";

const schema = {
  name: { type: String, required: true },
  src: { type: Object, required: true },
};

const icon = new Schema(schema);
const Icon = model('Icon', icon);

export default Icon;

export type TIcon = {
  name: string,
  src: ReactElement,
};
