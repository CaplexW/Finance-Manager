import { Operation } from "../../types/types";

export default function sortOperationsByAmount(arr: Operation[], direction: Directions = 'asc'): Operation[] {
  const copyArr = [...arr];
  if (direction === 'asc') copyArr.sort((a, b) => a.amount - b.amount);
  if (direction === 'desc') copyArr.sort((a, b) => b.amount - a.amount);

  return copyArr;
}

type Directions = 'asc' | 'desc';
