export default function getSomeDaysAgoDate(days: number) {
  const today = new Date();
  const resultDate = new Date(today);
  resultDate.setDate(today.getDate() - days);

  return resultDate;
}