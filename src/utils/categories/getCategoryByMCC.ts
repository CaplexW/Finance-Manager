import { Types } from "mongoose";
import getCategoryIdByName from "./getCategoryByName.ts";
import defaultCategories from "../../server/initialData/defaultCategories.ts";

export default async function getCategoryByMCC(MCC: string): Promise<Types.ObjectId | null> {
  let categoryId;
  
  switch (MCC.trim()) {
    case '':
      return null;
    case '5411': case '5921':
      categoryId = await getCategoryIdByName(defaultCategories[1].name);
      break;
    default:
      categoryId = await getCategoryIdByName(defaultCategories[14].name);
      break;
  }

  if (categoryId) return categoryId;
  throw new Error(`Category was not found during check MCC: ${MCC}`);
}