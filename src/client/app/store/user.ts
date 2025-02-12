import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import showError from "../../../utils/console/showError";
import { Credentials, ErrorMessage, GlobalState, RegisterPayload, User, UserState } from "../../../types/types";
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
    updateUserBalanceRequested() { },
    updateUserBalanceSucceed(state: UserState, action: PayloadAction<number>) {
      if (state.userData) {
        const { currentBalance } = state.userData;
        if (currentBalance) {
          state.userData.currentBalance = currentBalance + action.payload;
        }
      }
    },
    updateUserBalanceFailed(state: UserState, action: PayloadAction<unknown>) {
      const { message } = action.payload as ErrorMessage;
      state.error = message || 'Error occured in attempt of update user balance but there is no error message to display';
    },
    userLoadFailed(state: UserState, action: PayloadAction<unknown>) {
      const { message } = action.payload as ErrorMessage;
      state.error = message || 'Error occured in attempt of load user data but there is no error message to display';
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
  updateUserBalanceRequested,
  updateUserBalanceSucceed,
  updateUserBalanceFailed,
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
      userLoadFailed(err);
    }
  };
}
export function updateUserBalance(difference: number) {
  return function dispatchUpdate(dispatch: Dispatch) :boolean {
    dispatch(updateUserBalanceRequested());
    try {
      dispatch(updateUserBalanceSucceed(difference));
      return true;
    } catch (err) {
      dispatch(updateUserBalanceFailed(err));
      return false;
    }
  }
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
      console.log(err);
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
      console.log('logging out...');
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
export function getUserBalance() {
  return function findUser({ user }: GlobalState): number | undefined {
    return user.userData?.currentBalance;
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

