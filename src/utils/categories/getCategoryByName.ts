import { Types } from 'mongoose';
import Category from '../../server/models/Category.ts';
import capitalize from '../capitalize.ts';
import Operation from '../../server/models/Operation.ts';

export default async function getCategoryIdByName(categoryName: string): Promise<Types.ObjectId> {
  const category = await Category.find({ name: capitalize(categoryName) });
  return category._id;
}
