import { Types } from "mongoose";
import determineCategoryFromTinkoffData from "../categories/determineCategoryFromTinkoffData.ts";
import { formatInputDateFromDisplay } from "../formatDate.ts";

export default async function createOperationFromTinkoffData(rawCSV: string[][]): Promise<OperationData[]> {
  const array = await Promise.all(rawCSV.map(async (row) => {
    if (row[3] === 'FAILED') return null;
      const operation = {
        date: formatInputDateFromDisplay(row[1]),
        amount: parseInt(row[6]),
        name: row[11],
        category: await determineCategoryFromTinkoffData(row),
      };
      return operation;
  })
  );
  const filteredArray = array.filter((row) => row !== null);
  return filteredArray;
}

type OperationData = {
  date: string,
  amount: number,
  name: string,
  category: Types.ObjectId,
  user?: Types.ObjectId | string
};