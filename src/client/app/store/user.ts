import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import showError from "../../../utils/console/showError";
import { Credentials, GlobalState, RegisterPayload, User, UserState } from "../../../types/types";
import authService from "../services/auth.service";
import { getAccessToken, getUserId, removeAuthData, setTokens } from "../services/storage.service";
import userService from "../services/user.service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../utils/console/showElement";

const initialState = initState();
const sliceConfig = {
  name: 'user',
  initialState,
  reducers: {
    authRequested() { },
    authRequestSucceed(state: UserState, action: PayloadAction<string>) {
      state.auth = action.payload;
      state.isLogged = Boolean(action.payload);
    },
    authRequestFailed(state: UserState, action: PayloadAction<unknown>) {
      state.error = action.payload;
    },
    userLoadRequested() { },
    userLoadSucceed(state: UserState, action: PayloadAction<User>) {
      state.userData = action.payload;
      state.dataLoaded = Boolean(action.payload);
    },
    userLoadFailed(state: UserState, action: PayloadAction<unknown>) {
      state.error = action.payload;
    },
    userLoggedOut(state: UserState) {
      state.auth = null;
      state.dataLoaded = false;
      state.error = null;
      state.isLogged = false;
      state.userData = null;
    },
    userLogoutFailed(state: UserState, action: PayloadAction<unknown>) {
      state.error = action.payload;
    }

  }
};

const userSlice = createSlice(sliceConfig);
const { reducer: userReducer, actions } = userSlice;
const {
  authRequested,
  authRequestSucceed,
  authRequestFailed,
  userLoadRequested,
  userLoadSucceed,
  userLoadFailed,
  userLoggedOut,
  userLogoutFailed,
} = actions;

export function loadUserData() {
  return async function dispatchRequest(dispatch: Dispatch) {
    dispatch(userLoadRequested());
    try {
      const user = await userService.getAuthed();
      dispatch(userLoadSucceed(user));
    } catch (err) {
      userLoadFailed(err.message);
    }
  };
}

export function signUp(payload: RegisterPayload) {
  return async function (dispatch: Dispatch) {
    dispatch(authRequested());
    try {
      const data = await authService.register(payload); // Получаем данные с сервера.
      setTokens(data); // Пишим токен в localstorage
      dispatch(authRequestSucceed(data.userId)); // Пишим id авторизованного юзера в стор.
    } catch (err) {
      dispatch(authRequestFailed(err));
      showError(err);
    }
  };
}
export function signIn(payload: Credentials) {
  return async function dispatchLogin(dispatch: Dispatch) {
    dispatch(authRequested());
    try {
      const authData = await authService.login(payload);

      dispatch(authRequestSucceed(authData.userId));

      setTokens(authData);

      return 'success';
    } catch (err) {
      authRequestFailed(err);
      return 'error';
    }
  };
}
export function logOut() {
  return (dispatch: Dispatch) => {
    try {
      removeAuthData();
      dispatch(userLoggedOut());
    } catch (err) {
      dispatch(userLogoutFailed(err));
    }
  };
}
export function getUser() {
  return function findUser({ user }: GlobalState): User | null {
    return user.userData;
  };
}
export function getLoginStatus() { return (s: GlobalState): boolean => s.user.isLogged; }
export function getUserDataStatus() { return (s: GlobalState): boolean => s.user.dataLoaded; }

function initState(): UserState {
  let state: UserState;
  if (getAccessToken()) {
    state = {
      auth: getUserId(),
      userData: null,
      isLogged: true,
      dataLoaded: false,
      error: null,
    };
  } else {
    state = {
      auth: null,
      userData: null,
      isLogged: false,
      dataLoaded: false,
      error: null,
    };
  }

  return state;
}

export default userReducer;

