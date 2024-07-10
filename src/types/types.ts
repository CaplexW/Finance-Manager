/* eslint-disable @typescript-eslint/ban-types */
import { ActionCreatorWithNonInferrablePayload, ActionCreatorWithPayload, ActionCreatorWithoutPayload, PayloadAction } from "@reduxjs/toolkit";
import { ReactElement } from "react";

export type Credentials = { email: string, password: string };
export type RegisterPayload = { email: string, password: string, name: string };
export type ErrorMessage = { message: string };
export type RemoveResult = {
  result: number,
  newBalance: number
};

export type User = {
  _id: string,
  name: string,
  email: string,
  currentBalance: number,
  image: string | null,
  goals: string[],
  accounts: string[],
  operations: string[],
  categories: string[],
};
export type Operation = {
  _id: string,
  name: string,
  amount: number,
  category: string,
  date: string,
  user: string,
};
export type Category = null | {
  _id: string,
  name: string,
  color: string,
  isIncome: boolean,
  icon: ReactElement
};
export type Account = {
  _id: string,
  name: string,
  type: 'savings' | 'credit' | 'deposit' | 'debit',
  currentBalance: number,
  user: string,
  goal: string,
  percent: number,
  image: string,
};
export type Goal = {
  _id: string,
  name: string,
  goalPoint: number,
  status: 'complete' | 'in progress' | 'abandoned',
  user: string,
  account: string,
};

export type UserState = {
  auth: string | null,
  userData: User | null,
  isLogged: boolean,
  dataLoaded: boolean,
  error: unknown | null,
};
export type OperationsState = {
  entities: Operation[] | null,
  isLoaded: boolean,
  error: unknown | null
};
export type CategoriesState = {
  entities: Category[] | null,
  isLoaded: boolean,
  error: unknown | null
};
export type AccountsState = {
  entities: Account[] | null,
  isLoaded: boolean,
  error: unknown | null
};
export type GoalsState = {
  entities: Goal[] | null,
  isLoaded: boolean,
  error: unknown | null
};

export type GlobalState = {
  user: UserState,
  operations: OperationsState,
  categories: CategoriesState,
  accounts: AccountsState,
  goals: GoalsState,
};
export type GetStateFuncion = () => GlobalState;

export type CrudData = Operation | Category | Account | Goal | null;
export type CrudDataState =  {
  entities: CrudData[] | null,
  isLoaded: boolean,
  error: unknown | null
};
export type CrudActions = {
  loadRequested: ActionCreatorWithoutPayload<`${string}/loadRequested`>,
  loadSucceed: ActionCreatorWithPayload<CrudData[], `${string}/loadSucceed`>,
  loadFailed: ActionCreatorWithNonInferrablePayload<`${string}/loadFailed`>,
  updateRequested: ActionCreatorWithoutPayload<`${string}/updateRequested`>,
  updateSucceed: ActionCreatorWithPayload<CrudData, `${string}/updateSucceed`>,
  updateFailed: ActionCreatorWithNonInferrablePayload<`${string}/updateFailed`>,
  creationRequested: ActionCreatorWithoutPayload<`${string}/creationRequested`>,
  creationSucceed: ActionCreatorWithPayload<CrudData, `${string}/creationSucceed`>,
  creationFailed: ActionCreatorWithNonInferrablePayload<`${string}/creationFailed`>,
  deleteRequested: ActionCreatorWithoutPayload<`${string}/deleteRequested`>,
  deleteSucceed: ActionCreatorWithPayload<string, `${string}/deleteSucceed`>,
  deleteFailed: ActionCreatorWithNonInferrablePayload<`${string}/deleteFailed`>,
};
export interface CrudService<T extends CrudData>  {
  getList: () => Promise<T[]>,
  update: (payload: T) => Promise<T>,
  create: (payload: T) => Promise<T>,
  delete: (id: string) => Promise<RemoveResult>,
};
export type CrudStoreName = 'operations' | 'categories' | 'goals' | 'accounts';