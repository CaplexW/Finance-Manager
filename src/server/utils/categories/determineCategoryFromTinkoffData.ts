import { Types } from "mongoose";
import getCategoryByName from "./getCategoryByName.ts";
import getCategoryByMCC from "./getCategoryByMCC.ts";
import determineTransferType from "./determineTransferType.ts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../console/showElement.ts";

export default async function determineCategoryFromTinkoffData(operation: OperationData): Promise<Types.ObjectId> {

  let result;
  result = operation.category === 'Переводы' ? null : await getCategoryByName(operation.category);
  if (result) return result._id;
  result = await getCategoryByMCC(operation.mcc);
  if (result) return result._id;
  result = await determineTransferType(operation.amount);
  if (result) return result;

  throw new Error(`Cannot determine category from row named ${operation.name}, with MCC ${operation.mcc}`);
}

type OperationData = {
  time: string,
  date: string,
  cardNumber: string,
  status: string,
  amount: number,
  currency: string,
  category: string,
  mcc: number,
  name: string,
};
