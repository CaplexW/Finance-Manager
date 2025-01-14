export default function getLastMonthsBorders(months: number) {
  const today = new Date();

  const firstDay = new Date(today.getFullYear(), today.getMonth() - months, 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return { firstDay, lastDay };
}