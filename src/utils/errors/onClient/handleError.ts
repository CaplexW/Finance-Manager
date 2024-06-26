import showElement from '../../console/showElement.ts';
import createErrorMessage from './createErrorMessage.ts';
import displayError from './displayError.ts';


export default function handleError(err: unknown) {
  const errorMessage = createErrorMessage(err);
  showElement(errorMessage, 'errorMessage');
  displayError(errorMessage);
  if (!errorMessage) showElement(err, 'Вывожу полученную ошибку для анализа');
}
