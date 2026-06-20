import { OperationData } from "./createOperationFromTinkoffData.ts";

export default function filterMutuallyExclusiveOperations(operations: OperationData[]): OperationData[] {
  const toExclude = new Set<OperationData>();
  const groups = new Map<string, OperationData[]>();
  
  operations.forEach(op => {
    const key = `${op.name}||${op.date}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(op);
  });

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
  return operations.filter(op => !toExclude.has(op));
}
