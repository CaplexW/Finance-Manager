export default function calculateAmount(category, amount) {
  return category.income ? Number(amount) : Number(-amount);
}
