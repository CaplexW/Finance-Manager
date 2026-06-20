import { OperationData } from "./createOperationFromTinkoffData.ts";

/**
 * Фильтрует взаимоисключающие операции из массива
 * Взаимоисключающие операции - это операции с:
 * - одинаковым названием
 * - одинаковой датой
 * - противоположной суммой (зеркальные суммы)
 */
export default function filterMutuallyExclusiveOperations(operations: OperationData[]): OperationData[] {
  const toExclude = new Set<OperationData>();

  // Группируем ВСЕ операции по name + date (независимо от категории)
  const groups = new Map<string, OperationData[]>();
  
  operations.forEach(op => {
    const key = `${op.name}||${op.date}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(op);
  });

  // Находим взаимноисключающие пары
  for (const ops of groups.values()) {
    for (let i = 0; i < ops.length; i++) {
      for (let j = i + 1; j < ops.length; j++) {
        const amount1 = ops[i].amount;
        const amount2 = ops[j].amount;
        // Проверяем, что суммы противоположные (одна положительная, другая отрицательная) и равны по модулю
        if (Math.abs(amount1) === Math.abs(amount2) && amount1 !== amount2) {
          toExclude.add(ops[i]);
          toExclude.add(ops[j]);
        }
      }
    }
  }

  // Фильтруем исходный массив, исключая взаимноисключающие операции
  return operations.filter(op => !toExclude.has(op));
}
