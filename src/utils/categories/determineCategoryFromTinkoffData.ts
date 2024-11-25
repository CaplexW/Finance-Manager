import { Types } from "mongoose";
import getCategoryIdByName from "./getCategoryByName.ts";
import getCategoryByMCC from "./getCategoryByMCC.ts";
import determineTransferType from "./determineTransferType.ts";

export default async function determineCategoryFromTinkoffData(rowCSV: string[]): Promise<Types.ObjectId> {
  let result;
  result = await getCategoryIdByName(rowCSV[9]);
  if (result) return result;
  result = await getCategoryByMCC(rowCSV[10]);
  if (result) return result;
  result = await determineTransferType(rowCSV[6]);
  if (result) return result;

  throw new Error(`Cannot determine category from row named ${rowCSV[9]}, with MCC ${rowCSV[10]}`);
  
}