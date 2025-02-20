import { Types } from "mongoose";
import getCategoryByName from "./getCategoryByName.ts";
import getCategoryByMCC from "./getCategoryByMCC.ts";
import determineTransferType from "./determineTransferType.ts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../console/showElement.ts";

export default async function determineCategoryFromTinkoffData(rowCSV: string[]): Promise<Types.ObjectId> {
  // showElement(rowCSV, 'rowCSV'); //TODO разобрать массив по названиям
  let result;
  result = await getCategoryByName(rowCSV[9]);
  if (result) return result._id;
  result = await getCategoryByMCC(rowCSV[10]);
  if (result) return result._id;
  result = await determineTransferType(rowCSV[6]);
  if (result) return result;

  throw new Error(`Cannot determine category from row named ${rowCSV[9]}, with MCC ${rowCSV[10]}`);
  
}