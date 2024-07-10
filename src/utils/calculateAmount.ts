import Category from "../server/models/Category.ts";
import showError from "./console/showError.ts";

export default async function calculateAmount(request: OperationCreateRequest) {
  const operationCategory = await Category.findById(request.category);
  if (operationCategory) {
    return operationCategory.isIncome ? Number(request.amount) : Number(-request.amount);
  } else {
    showError('Category not found!');
    throw new Error("Category not found!");
  }
}

type OperationCreateRequest = {
  category: string,
  amount: number | string,
};