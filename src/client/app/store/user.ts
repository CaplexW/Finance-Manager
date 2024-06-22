import { createSlice } from "@reduxjs/toolkit";
import showError from "../../../utils/console/showError";
import { Credentials } from "../../../types/types";

const sliceConfig = {
  name: 'user',
  initialState: {
    auth: 'userId',
    isLogged: true,
    userInfo: {
      name: 'name',
      email: 'email',
      etc: 'etc...',
    },
    dataLoaded: false,
    error: null,
  },
  reducers: {
    authReuested() { },
    authRequestSucceed(state, action) {
      state.auth = action.payload;
      state.isLoggedIn = true;
    },
    authRequestFailed(state, action) {
      state.error = action.payload;
    },
  }
};

const userSlice = createSlice(sliceConfig);
const { reducer: userReducer, actions } = userSlice;
const { authReuested, authRequestSucceed, authRequestFailed } = actions;

export function signUp(payload) {
  return async function (dispatch) {
    dispatch(authReuested());
    try {
      const data = await authService.register(payload); // Получаем данные с сервера.
      setTokens(data); // Пишим токен в localstorage
      dispatch(authRequestSucceed(data.userId)); // Пишим id авторизованного юзера в стор.
    } catch (err) {
      dispatch(authRequestFailed(err.message));
      showError(err);
    }
  };
}
export function signIn({ email, password }: Credentials) {
  return async function dispatchLogin(dispatch) {
    dispatch(authRequested());
    try {
      const data = await authService.login(email, password);
      dispatch(authRequestSucceed(data.userId));
      setTokens(data);
      return 'success';
    } catch (err) {
      authRequestFailed(err.message);
      return 'error';
    }
  };
}

export default userReducer;
