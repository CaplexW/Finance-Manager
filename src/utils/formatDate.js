export function formatDisplayDate(date) {
  return Intl.DateTimeFormat('ru').format(date);
}
export function formatInputDate(date) {
  const displayedDate = formatDisplayDate(date);
  const splitedDate = displayedDate.split('.');
  const valueDate = `${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}`;
  return valueDate;
}
export function formatDisplayDateFromInput(date) {
  const splitedDate = date.split('-');
  const formatedDate = `${splitedDate[2]}.${splitedDate[1]}.${splitedDate[0]}`;
  return formatedDate;
} 
export function todayDisplay() {
  return formatDisplayDate(new Date());
}
export function todayInput() {
  return formatInputDate(new Date());
}
export function tomorrowDisplay() {
  return formatDisplayDate(new Date().setDate(new Date().getDate() + 1));
}
export function tomorrowInput() {
  return formatInputDate(new Date().setDate(new Date().getDate() + 1));
}
export function yesterdayDisplay() {
  return formatDisplayDate(new Date().setDate(new Date().getDate() - 1));
}
export function yesterdayInput() {
  return formatInputDate(new Date().setDate(new Date().getDate() - 1));
}
export function weekAgoDisplay() {
  return formatDisplayDate(new Date().setDate(new Date().getDate() - 7));
}
export function weekAgoInput() {
  return formatInputDate(new Date().setDate(new Date().getDate() - 7));
}
export function lastMonthInput() {
  return formatInputDate(new Date().setDate(new Date().getDate() - 30));
}
export function firstDayOfMonthInput() {
  const displayedDate = formatDisplayDate(new Date());
  const splitedDate = displayedDate.split('.');
  const valueDate = `${splitedDate[2]}-${splitedDate[1]}-01`;
  return valueDate;
}
