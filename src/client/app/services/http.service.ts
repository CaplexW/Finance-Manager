import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
  getAccessToken, getRefreshToken, getTokenExpiresDate, setTokens,
} from './storage.service';
import authService from './auth.service';
import handleError from '../../../utils/errors/onClient/handleError';
import config from '../../../config/config';

const http = axios.create({
  baseURL: config.API_ENDPOINT,
});

http.interceptors.request.use(modifyRequest, handleError);

const httpService = {
  get: http.get,
  put: http.put,
  post: http.post,
  patch: http.patch,
  delete: http.delete,
};

async function modifyRequest(request: InternalAxiosRequestConfig) {
  const expiresDate = Number(getTokenExpiresDate());
  const refreshToken = getRefreshToken();
  const tokenIsExpired = refreshToken && (expiresDate < Date.now());

  if (tokenIsExpired) {
    const data = await authService.refresh();
    try {
      setTokens(data);
    } catch (err) {
      handleError(err);
    }
  }
  const accessToken = getAccessToken();
  if (accessToken) {
    request.headers.set('Authorization', `Bearer ${accessToken}`); // TODO Проверить что это работает.
  }
  return request;
}

export default httpService;
