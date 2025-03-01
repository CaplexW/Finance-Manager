import { Schema, model } from "mongoose";

const schema = {
  code: { type: Number, required: true },
  name: { type: String, required: true },
};

const mcc = new Schema(schema, { timestamps: true });
const MCC = model('MCC', mcc);

export default MCC;

export type TMcc = {
  code: number,
  name: string,
};
 