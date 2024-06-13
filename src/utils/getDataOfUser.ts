import { Mongoose } from "mongoose";
import User from "../server/models/User.ts";

export default async function getDataOfUser(id: string, model: Mongoose['Model']) {
  const user = await User.findById(id);
  if (!user) return null;
  return await model.find({ user: id });
}