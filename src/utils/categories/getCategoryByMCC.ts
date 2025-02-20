import getCategoryByName from "./getCategoryByName.ts";
import MCC from "../../db/models/mcc.ts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../console/showElement.ts";
import { CategoryDocument } from "../../db/models/Category.ts";
import { DefaultCategoryDoument } from "../../db/models/DefaultCategory.ts";

export default async function getCategoryByMCC(code: string): Promise<CategoryDocument | DefaultCategoryDoument | null> {
  if (!code) return null;

  const mcc = await MCC.findOne({ code });
  const category = await getCategoryByName(mcc ? mcc.name : 'Разное');

  if (category) return category;
  throw new Error(`Category was not found during check MCC: ${code}`);
}
