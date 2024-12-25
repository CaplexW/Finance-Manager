import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import config from '../../../config/config';

const reducerConfig = {
  user: userReducer,
  // // categories: categoriesReducer,
  // // operations: opertionsReducer,
  // // goals: goalsReducer,
  // // accounts: accountsReducer,
};
const rootReducer = combineReducers(reducerConfig);

const storeConfig = {
  reducer: rootReducer,
  devTools: !config.IN_PRODUCTION,
};

export default function createStore() {
  return configureStore(storeConfig);
}
