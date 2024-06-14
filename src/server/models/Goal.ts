import { Schema, Types, model } from "mongoose";

const schema = {
  name: { type: String, required: true },
  goalPoint: { type: Number, required: true },
  status: { type: String, enum: ['complete', 'in progress', 'abandoned'], required: true }, // TODO защитить от некорректного апдейта.
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
};

const goal = new Schema(schema, { timestamps: true });
const Goal =  model('Goal', goal);

export default Goal;

export interface IGoal {
  name: string,
  GoalPoint: number,
  status: string,
  user: Types.ObjectId,
  account?: Types.ObjectId,
}
