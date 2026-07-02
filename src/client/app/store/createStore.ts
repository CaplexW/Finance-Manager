import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import config from '../../../config/config';
import operationsReducer from './operations';
import categoriesReducer from './categories';
import iconsReducer from './icons';
import { importPresetsReducer } from './importPresets';

const reducerConfig = {
  user: userReducer,
  operations: operationsReducer,
  categories: categoriesReducer,
  icons: iconsReducer,
  importPresets: importPresetsReducer,
  // // goals: goalsReducer,
  // // accounts: accountsReducer,
};
const rootReducer = combineReducers(reducerConfig);

const storeConfig = {
  reducer: rootReducer,
  devTools: !config.IN_PRODUCTION,
};

function createStore() {
  return configureStore(storeConfig);
}

export const store = createStore();

const RootState = store.getState();
export type RootState = typeof RootState;
