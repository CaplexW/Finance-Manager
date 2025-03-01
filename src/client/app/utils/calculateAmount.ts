export default function calculateAmount(operation: OperationCreateRequest, categoryIsIncome: boolean) {
    return categoryIsIncome ? Number(operation.amount) : Number(-operation.amount);
}

type OperationCreateRequest = {
  category: string,
  amount: number | string,
};