import { Types } from "mongoose";
import defaultCategories from "../../../db/initialData/defaultCategories.ts";
import getCategoryByName from "./getCategoryByName.ts";

export default async function determineTransferType(amount: number): Promise <Types.ObjectId> {
  const IncomingTransferCategory = defaultCategories[16];
  const OutgoingTransferCategory = defaultCategories[15];
  const isIncome = amount > 0;
  
  const transferType = isIncome ? IncomingTransferCategory.name : OutgoingTransferCategory.name;
  const category = await getCategoryByName(transferType);

  if (category) return category._id;
  throw new Error(`Category named ${transferType} was not found`);
}
