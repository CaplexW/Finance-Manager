import Category from "../server/models/Category.ts";
import showError from "./console/showError.ts";

export default async function calculateAmount(request: categoryCreateRequest) {
  const operationCategory = await Category.findById(request.category);
  if (operationCategory) {
    if (operationCategory.type === "income") return Number(request.amount);
    if (operationCategory.type === "outcome") return Number(-request.amount);
  } else {
    showError('Category not found!');
    throw new Error("Category not found!");
  }

  showError('Type of category is incorrect!');
  throw new Error("Type of category is incorrect!");
}

type categoryCreateRequest = {
  category: string,
  amount: number | string,
};