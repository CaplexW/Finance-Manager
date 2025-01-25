import { Operation } from "../types/types.ts";
import getTodayDate from "./date/getTodayDate.ts";
import { getInputDate } from "./formatDate.ts";

export default function getBalanceHistory(
  daysRange: number,
  operations: Operation[],
  currentBalance: number
): Map<string, number> {
  const map = new Map();
  const today = getTodayDate();
  const daysArray = new Array(daysRange).fill(0);

  daysArray.reduce((balance, _, day) => {
    const date = getInputDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - day));
    const prevDate = getInputDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - day + 1));
    const dateOperations = operations.filter((op) => op.date === prevDate);
    const dateBalanceChange = dateOperations.reduce((acc, op) => (acc += op.amount), 0);
    balance -= dateBalanceChange;

    map.set(date, balance);
    return balance;
  }, currentBalance);

  return map;
}