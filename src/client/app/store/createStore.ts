import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import config from '../../../config/config';
import operationsReducer from './operations';
import categoriesReducer from './categories';

const reducerConfig = {
  user: userReducer,
  operations: operationsReducer,
  categories: categoriesReducer,
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
