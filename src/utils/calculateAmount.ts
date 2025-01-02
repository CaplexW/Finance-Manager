import Category, { TCategory } from "../db/models/Category.ts";
import showError from "./console/showError.ts";

export default async function calculateAmount(operation: OperationCreateRequest, categoryIsIncome: boolean) {
    return categoryIsIncome ? Number(operation.amount) : Number(-operation.amount);
}

type OperationCreateRequest = {
  category: string,
  amount: number | string,
};