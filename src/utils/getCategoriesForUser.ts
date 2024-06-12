import Category from "../server/models/Category.ts";
import User from "../server/models/User.ts";

export default async function getCategoriesForUser(id: string) {
  const user = await User.findById(id);
  if (!user) return null;

  return await Promise.all(user.categories.map((catId) => Category.findById(catId)));
}