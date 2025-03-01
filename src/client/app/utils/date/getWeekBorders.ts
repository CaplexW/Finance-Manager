import showElement from "../console/showElement.ts";

export default function getWeekBorders() {
  const today = new Date();
  const dayOfWeek = adjustDayOfWeek(today.getDay());

  const firstDay = new Date();
  firstDay.setDate(today.getDate() - dayOfWeek);

  const lastDay = new Date();
  lastDay.setDate(today.getDate() + (6 - dayOfWeek));

  return { firstDay, lastDay };
}

export function adjustDayOfWeek(day: number) {
  return day === 0 ? 6 : day - 1;
}