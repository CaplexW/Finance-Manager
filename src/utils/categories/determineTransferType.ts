import { Types } from "mongoose";
import defaultCategories from "../../db/initialData/defaultCategories.ts";
import getCategoryIdByName from "./getCategoryByName.ts";

export default async function determineTransferType(amount: string): Promise <Types.ObjectId> {
  const isIncome = parseInt(amount) > 0;
  const transferType = isIncome ? defaultCategories[16].name : defaultCategories[15].name;
  const categoryId = await getCategoryIdByName(transferType);

  if (categoryId) return categoryId;
  throw new Error(`Category with named ${transferType}`);
}
