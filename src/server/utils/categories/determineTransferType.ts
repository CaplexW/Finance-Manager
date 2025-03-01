import { Types } from "mongoose";
import defaultCategories from "../../../db/initialData/defaultCategories.ts";
import getCategoryByName from "./getCategoryByName.ts";

export default async function determineTransferType(amount: number): Promise <Types.ObjectId> {
  const isIncome = amount > 0;
  const transferType = isIncome ? defaultCategories[16].name : defaultCategories[15].name;
  const category = await getCategoryByName(transferType);

  if (category) return category._id;
  throw new Error(`Category named ${transferType} was not found`);
}
