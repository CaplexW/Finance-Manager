import { removeAuthData } from '../../../services/storage.service.ts';
import showElement from '../../console/showElement.ts';
import createErrorMessage, { CreatedErrorMessage } from './createErrorMessage.ts';
import displayError from './displayError.ts';

const invalidToken = 'Token is invalid';

export default function handleError(err: ExpectedError) {
  const errorMessage: CreatedErrorMessage = createErrorMessage(err);
  if (!errorMessage) return showElement(err, 'Вывожу полученную ошибку для анализа');
  if (typeof errorMessage === 'object') {
    displayError(errorMessage.client);
    showElement(errorMessage.server, 'Error ocured');
    if (errorMessage.server === invalidToken) removeAuthData();
  }
  if (typeof errorMessage === 'string') {
    if (errorMessage === invalidToken) removeAuthData();
    return displayError(errorMessage);
  }
}

export type ExpectedError = {
  response: {
    status: number,
    data: {
      message: string,
      error: { code: number, message: string } | string,
    },
  },
  message: string,
  code: number,
  errors?: string[],
};
