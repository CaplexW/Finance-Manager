export default function catchError(err:unknown, notificationCallback = console.log) {
  notificationCallback('ERROR:', err);
}
