// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "./console/showElement.ts";

export function getDisplayDate(date: Date): string {
  return Intl.DateTimeFormat('ru').format(date);
}
export function getInputDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const valueDate = `${year}-${month > 8 ? month + 1 : '0' + (month + 1)}-${day > 9 ? day : '0' + day}`;
  return valueDate;
}
export function formatDisplayDateFromInput(date: string): string {
  const splitedDate = date.split('-');
  const formatedDate = `${splitedDate[2]}.${splitedDate[1]}.${splitedDate[0][2] + splitedDate[0][3]}`;
  return formatedDate;
}
export function formatInputDateFromDisplay(date: string): string {
  const splitedDate = date.split('.');
  const formatedDate = `${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}`;
  return formatedDate;
}
export function todayDisplay() {
  return getDisplayDate(new Date());
}
export function todayInput() {
  return getInputDate(new Date());
}
export function tomorrowInput(): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return getInputDate(tomorrow);
}
export function firstDayOfMonthInput() {
  const displayedDate = getDisplayDate(new Date());
  const splitedDate = displayedDate.split('.');
  const valueDate = `${splitedDate[2]}-${splitedDate[1]}-01`;
  return valueDate;
}
