import { Types } from 'mongoose';
import Category from '../../db/models/Category.ts';
import capitalize from '../capitalize.ts';
import DefaultCategory from '../../db/models/DefaultCategory.ts';
import showElement from '../console/showElement.ts';

export default async function getCategoryIdByName(categoryName: string): Promise<Types.ObjectId | null> {
  let category = await Category.findOne({ name: capitalize(categoryName) });
  if(!category) category = await DefaultCategory.findOne({ name: capitalize(categoryName) });

  if(!category) return null;
  return category._id;
}
