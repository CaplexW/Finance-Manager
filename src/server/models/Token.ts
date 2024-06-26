import { Schema, Types, model } from "mongoose";

const schema = {
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
};

const token = new Schema(schema, { timestamps: true });
const Token = model('Token', token);

export default Token;

export interface IToken {
  _id?: Types.ObjectId,
  user: Types.ObjectId,
  refreshToken: string,
}
