import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user';

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
};

export default function createStore() {
  return configureStore(storeConfig);
}
