export default function getTodayDate(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today;
}
