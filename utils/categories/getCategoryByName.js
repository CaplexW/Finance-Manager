import { getCategories } from '../api/userData';
import capitalize from '../capitalize';

export default function getCategoryByName(categoryName) {
  return getCategories().filter((category) => category.name === capitalize(categoryName))[0];
}
