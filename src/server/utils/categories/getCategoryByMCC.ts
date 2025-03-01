import MCC from "../../../db/models/Mcc.ts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../console/showElement.ts";
import Category, { CategoryDocument } from "../../../db/models/Category.ts";
import DefaultCategory, { DefaultCategoryDoument } from "../../../db/models/DefaultCategory.ts";

export default async function getCategoryByMCC(code: number): Promise<CategoryDocument | DefaultCategoryDoument | null> {
  if (!code || isNaN(code)) return null;

  const mcc = await MCC.findOne({ code });
  let category;

  if (!mcc) category = await DefaultCategory.findOne({ name: 'Разное' });
  if (mcc) category = await DefaultCategory.findOne({ name: mcc.name });
  if (mcc && !category) category = await Category.findOne({ name: mcc.name });
  if (mcc && !category) category = await DefaultCategory.findOne({ name: 'Разное' });

  if (category) return category;
  throw new Error(`Category was not found during check MCC: ${code}`);
}
