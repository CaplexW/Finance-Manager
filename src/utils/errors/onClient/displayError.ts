import { toast } from 'react-toastify';

/* eslint-disable no-alert */
export default function displayError(error: string | boolean | { message: string }) {
  let message;

  if (typeof error === 'string') message = error;
  if (typeof error === 'object') [message] = Object.values(error);
  if (!error) message = 'Неожиданная ошибка';

  toast.error(message);
}
