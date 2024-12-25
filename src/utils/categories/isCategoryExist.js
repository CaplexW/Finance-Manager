import { getCategories } from '../api/userData';
import capitalize from '../capitalize';

export default function isCategoryExist(categoryName) {
  return getCategories().some(
    (category) => category.name === capitalize(categoryName),
  );
}
