import axios, { AxiosResponse } from 'axios';
import config from '../../../config/config';
import { Credentials, RegisterPayload } from '../../../types/types';
import handleError from '../../../utils/errors/onClient/handleError';
import { getRefreshToken } from './storageService';

const { API_ENDPOINT } = config;
const httpAuth = axios.create({ baseURL: `${API_ENDPOINT}auth/` });

const signUpEndpoint = 'signUp';
const singInEndpoint = 'signInWithPassword';
const tokenEndpoint = 'updateToken';

httpAuth.interceptors.response.use(passOnResponse, handleError);

const authService = {
  async register(payload: RegisterPayload) {
    const { data } = await httpAuth.post(signUpEndpoint, payload);
    return data;
  },
  async login(payload: Credentials) {
    const { data } = await httpAuth.post(singInEndpoint, payload);
    return data;
  },
  async refresh() {
    const { data } = await httpAuth.post(tokenEndpoint, {
      grant_type: 'refresh_token',
      refresh_token: getRefreshToken(),
    });
    return data;
  },
};

export default authService;

function passOnResponse(response: AxiosResponse) {
  return response;
}
