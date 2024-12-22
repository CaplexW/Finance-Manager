import showElement from "../../console/showElement.ts";
import { ExpectedError } from "./handleError.ts";

export default function createErrorMessage(err: ExpectedError): CreatedErrorMessage {
  let errorMessage;
  if (err.response.data.message === 'INVALID_CREDANTIALS' || err.response.data.message === 'Email not found') return 'Неверный логин или пароль';
  if ('code' in err) {
    if (typeof err.code === 'number') {
      const { code, message } = err.response.data.error;
      errorMessage = determineError(code, message);
    } else if (typeof err.code === 'string') {
      const { status, data } = err.response;
      errorMessage = determineError(status, data.error?.message || data.error || data.message);
    } else if (err.message && typeof err.message === 'string') {
      errorMessage = `unexpepected error: ${err.message}`;
    }
  }
  if (typeof errorMessage === 'string' || errorMessage?.server) return errorMessage;
  return false;
}

function determineError(code: number | undefined, message: string | undefined): CreatedErrorMessage {
  if (code === 400) {
    if (message === 'EMAIL_EXISTS') {
      return { client: 'Пользователь с таким email уже существует', server: message };
    };

    const credentialError = (message === 'INVALID_LOGIN_CREDENTIALS'
      || message === 'PASSWORD_IS_INVALID'
      || message === 'EMAIL_NOT_FOUND');
    if (credentialError) {
      return { client: 'Неверный логин или пароль', server: message };
    }

    return { client: 'Неожиданная ошибка', server: `${code}: ${message}` };
  }
  if (code === 401) {
    return { client: 'Ошибка авторизации:', server: `${message}` };
  }

  if (code) return `${code}: ${message}`;
  return false;
}

export type CreatedErrorMessage = { server: string, client: string } | string | false;
