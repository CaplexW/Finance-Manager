const TOKEN_KEY = 'jwt-token';
const REFRESH_KEY = 'jwt-refresh-token';
const EXPIRES_KEY = 'jwt-expires';
const USER_ID_KEY = 'user-local-id';

export function setTokens({
  refreshToken, userId, accessToken, expiresIn = 3600,
} : tokenRequest) {
  const expiresDate = new Date().getTime() + (expiresIn * 1000);
  localStorage.setItem(USER_ID_KEY, userId);
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(EXPIRES_KEY, expiresDate.toString());
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}
export function getTokenExpiresDate(): string | null {
  return localStorage.getItem(EXPIRES_KEY);
}
export function getUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}
export function removeAuthData() {
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  // window.location.reload(); // TODO Проверить нужно ли это. По возможности убрать.
}

const storageSerice = {
  setTokens,
  getAccessToken,
  getRefreshToken,
  getTokenExpiresDate,
  removeAuthData,
};

export default storageSerice;

type tokenRequest = {
  refreshToken: string,
  userId: string,
  accessToken: string
  expiresIn: number,
};
