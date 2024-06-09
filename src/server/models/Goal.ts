import { Schema, model } from "mongoose";

const schema = {
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['complete', 'in progress', 'abandoned']},
};

const goal = new Schema(schema, { timestamps: true });
const Goal =  model('Goal', goal);

export default Goal;
