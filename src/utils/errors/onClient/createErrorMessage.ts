import showElement from "../../console/showElement.ts";

export default function createErrorMessage(err: unknown): string | false {
  let errorMessage;
  showElement(err, 'error');
  if (err.response.data.message === 'INVALID_CREDANTIALS' || err.response.data.message === 'Email not found') return 'Неверный логин или пароль';
  if ('code' in err) {
    if (typeof err.code === 'number') {
      const { code, message } = err.response.data.error;
      errorMessage = determineError(code, message);
    } else if (typeof err.code === 'string') {
      showElement(err.response, 'err.response');
      const { status, data } = err.response;
      errorMessage = determineError(status, data.error?.message || data.error || data.message);
    } else if (err.message && typeof err.message === 'string') {
      errorMessage = `unexpepected error: ${err.message}`;
    }
  }
  if (typeof errorMessage === 'string') return errorMessage;
  return false;
}

function determineError(code: number | undefined, message: string | undefined): string | boolean {
  if (code === 400) {
    if (message === 'EMAIL_EXISTS') return 'Пользователь с таким email уже существует';
    if (message === 'INVALID_LOGIN_CREDENTIALS'
    || message === 'PASSWORD_IS_INVALID'
    || message === 'EMAIL_NOT_FOUND') return 'Неверный логин или пароль';
    return `Неожиданная ошибка: ${message}.`;
  }
  if (code === 401) {
    return `Ошибка авторизации: ${message}`;
  }
  if (code) return `${code}: ${message}`;
  return false;
}

type ExpectedError = {
  message: string,
  code: number,
  errors?: string[],
}