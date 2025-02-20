import Category, { CategoryDocument } from '../../db/models/Category.ts';
import capitalize from '../capitalize.ts';
import DefaultCategory, { DefaultCategoryDoument } from '../../db/models/DefaultCategory.ts';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../console/showElement.ts';

export default async function getCategoryByName(categoryName: string): Promise<CategoryDocument | DefaultCategoryDoument | null> {
  let category;
  
  if (categoryName) {
    category = await Category.findOne({ name: capitalize(categoryName) });
    if (!category) category = await DefaultCategory.findOne({ name: capitalize(categoryName) });
  }

  if(category) return category;
  return null;
}
