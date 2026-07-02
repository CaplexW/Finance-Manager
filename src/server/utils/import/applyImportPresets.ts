import { Types } from "mongoose";
import ImportPreset from "../../../db/models/ImportPreset.ts";
import { OperationData } from "./createOperationFromTinkoffData.ts";

export default async function applyImportPresets(
  operations: OperationData[],
  userId: Types.ObjectId
): Promise<OperationData[]> {
  // Загружаем все пресеты пользователя
  const presets = await ImportPreset.find({ user: userId }).sort({ serialNumber: 1 });
  
  if (presets.length === 0) {
    return operations; // Нет пресетов — возвращаем операции без изменений
  }

  // Сортируем пресеты по приоритету:
  // 1. Пресеты с суммой (amount !== undefined) имеют最高ий приоритет
  // 2. Остальные пресеты сортируем по количеству заполненных полей в importConditions (по убыванию)
  const sortedPresets = [...presets].sort((a, b) => {
    const aHasAmount = a.importConditions.amount !== undefined;
    const bHasAmount = b.importConditions.amount !== undefined;
    
    if (aHasAmount && !bHasAmount) return -1; // a имеет сумму, b — нет → a выше
    if (!aHasAmount && bHasAmount) return 1; // b имеет сумму, a — нет → b выше
    
    // Если оба имеют или не имеют сумму, сортируем по количеству заполненных полей
    const aFieldsCount = countFilledFields(a.importConditions);
    const bFieldsCount = countFilledFields(b.importConditions);
    return bFieldsCount - aFieldsCount; // Больше полей → выше приоритет
  });

  // Применяем пресеты к операциям
  const resultOperations = operations.map(operation => {
    for (const preset of sortedPresets) {
      if (matchesImportConditions(operation, preset.importConditions)) {
        return applyAssignValues(operation, preset.assignValues);
      }
    }
    return operation; // Если ни один пресет не подошёл, возвращаем операцию без изменений
  });

  return resultOperations;
}

// Считает количество заполненных полей в importConditions
function countFilledFields(conditions: {
  name?: string;
  category?: Types.ObjectId;
  amount?: number;
}): number {
  let count = 0;
  if (conditions.name !== undefined) count++;
  if (conditions.category !== undefined) count++;
  if (conditions.amount !== undefined) count++;
  return count;
}

// Проверяет, подходит ли операция под условия пресета
function matchesImportConditions(
  operation: OperationData,
  conditions: {
    name?: string;
    category?: Types.ObjectId;
    amount?: number;
  }
): boolean {
  // Если в условиях есть название, оно должно совпадать
  if (conditions.name !== undefined && operation.name !== conditions.name) {
    return false;
  }

  // Если в условиях есть категория, она должна совпадать
  if (conditions.category !== undefined) {
    // operation.category — это Types.ObjectId или string, приводим к строке для сравнения
    const operationCategoryStr = operation.category.toString();
    const conditionCategoryStr = conditions.category.toString();
    if (operationCategoryStr !== conditionCategoryStr) {
      return false;
    }
  }

  // Если в условиях есть сумма, она должна совпадать
  if (conditions.amount !== undefined && operation.amount !== conditions.amount) {
    return false;
  }

  // Если все заполненные условия совпали, пресет подходит
  return true;
}

// Применяет значения из assignValues к операции
function applyAssignValues(
  operation: OperationData,
  assignValues: {
    name?: string;
    category?: Types.ObjectId;
    amount?: number;
  }
): OperationData {
  const result = { ...operation };

  // Применяем новое название, если оно указано
  if (assignValues.name !== undefined) {
    result.name = assignValues.name;
  }

  // Применяем новую категорию, если она указана
  if (assignValues.category !== undefined) {
    result.category = assignValues.category;
  }

  // Применяем новую сумму, если она указана
  if (assignValues.amount !== undefined) {
    result.amount = assignValues.amount;
  }

  return result;
}
