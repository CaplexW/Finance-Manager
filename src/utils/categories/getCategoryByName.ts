import { Types } from 'mongoose';
import Category from '../../server/models/Category.ts';
import capitalize from '../capitalize.ts';

export default async function getCategoryIdByName(categoryName: string): Promise<Types.ObjectId | null> {
  const category = await Category.findOne({ name: capitalize(categoryName) });

  if(!category) return null;
  return category._id;
}
