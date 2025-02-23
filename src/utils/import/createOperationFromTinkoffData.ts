import { Types } from "mongoose";
import determineCategoryFromTinkoffData from "../categories/determineCategoryFromTinkoffData.ts";
import { formatInputDateFromDisplay } from "../formatDate.ts";

export default async function createOperationFromTinkoffData(rawCSV: string[][]): Promise<OperationData[]> {
  const array = await Promise.all(rawCSV.map(async (row) => {
    const operationData = {
      date: row[0].split(' ')[0],
      time: row[0].split(' ')[1],
      cardNumber: row[2],
      status: row[3],
      amount: parseFloat(row[4].replace(',', '.')),
      currency: row[5],
      category: row[9],
      mcc: parseInt(row[10]),
      name: row[11],
    };

    if (operationData.status === 'FAILED') return null;
    const operation = {
      date: formatInputDateFromDisplay(operationData.date),
      time: operationData.time,
      amount: operationData.amount,
      name: operationData.name,
      category: await determineCategoryFromTinkoffData(operationData),
    };
    return operation;
  })
  );
  const filteredArray = array.filter((row) => row !== null);
  return filteredArray;
}

export type OperationData = {
  date: string,
  time: string,
  amount: number,
  name: string,
  category: Types.ObjectId,
  user?: Types.ObjectId | string
};


