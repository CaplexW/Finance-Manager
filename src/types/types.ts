/* eslint-disable @typescript-eslint/ban-types */
import { ActionCreatorWithNonInferrablePayload, ActionCreatorWithPayload, ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { ReactElement } from "react";

export type Credentials = { email: string, password: string };
export type RegisterPayload = { email: string, password: string, name: string };
export type ErrorMessage = { message: string };
export type RemoveResult = {
  result: number,
  newBalance: number
};

export interface CRUDObject {
  _id: string,
}

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
export interface Operation extends CRUDObject {
  name: string,
  amount: number,
  category: string,
  date: string,
  user: string,
};
export interface Category extends CRUDObject {
  name: string;
  color: string;
  isIncome: boolean;
  icon: ReactElement //TODO изменить на _id когда изменю бд
};
export interface Account extends CRUDObject {
  name: string;
  type: 'savings' | 'credit' | 'deposit' | 'debit';
  currentBalance: number;
  user: string;
  goal: string;
  percent: number;
  image: string;
};
export interface Goal extends CRUDObject {
  name: string;
  goalPoint: number;
  status: 'complete' | 'in progress' | 'abandoned';
  user: string;
  account: string;
};
export interface Icon extends CRUDObject {
  src: ReactElement;
}

export type GlobalState = {
  user: UserState,
  operations: CRUDState<Operation>,
  categories: CRUDState<Category>,
  accounts: CRUDState<Account>,
  goals: CRUDState<Goal>,
  icons: CRUDState<Icon>,
};
export type GetStateFuncion = () => GlobalState;

export type CrudActions<CRUDEntity> = {
  loadRequested: ActionCreatorWithoutPayload<`${string}/loadRequested`>,
  loadSucceed: ActionCreatorWithPayload<CRUDEntity[], `${string}/loadSucceed`>,
  loadFailed: ActionCreatorWithNonInferrablePayload<`${string}/loadFailed`>,

  updateRequested: ActionCreatorWithoutPayload<`${string}/updateRequested`>,
  updateSucceed: ActionCreatorWithPayload<CRUDEntity, `${string}/updateSucceed`>,
  updateFailed: ActionCreatorWithNonInferrablePayload<`${string}/updateFailed`>,

  creationRequested: ActionCreatorWithoutPayload<`${string}/creationRequested`>,
  creationSucceed: ActionCreatorWithPayload<CRUDEntity, `${string}/creationSucceed`>,
  creationFailed: ActionCreatorWithNonInferrablePayload<`${string}/creationFailed`>,

  deleteRequested: ActionCreatorWithoutPayload<`${string}/deleteRequested`>,
  deleteSucceed: ActionCreatorWithPayload<string, `${string}/deleteSucceed`>,
  deleteFailed: ActionCreatorWithNonInferrablePayload<`${string}/deleteFailed`>,
};
export interface CrudService<CRUDEntity>  {
  getList: () => Promise<CRUDEntity[]>,
  update: (payload: CRUDEntity) => Promise<CRUDEntity>,
  create: (payload: CRUDEntity) => Promise<CRUDEntity>,
  delete: (id: string) => Promise<RemoveResult>,
};


export type CrudStoreName = keyof Omit<GlobalState, 'user'>;
export type CrudStoreObjects = Operation | Icon | Goal | Account | Category;

export interface State {
  error: unknown | null;
  isLoaded: boolean;
};
export interface CRUDState<CRUDEntity> extends State {
  entities: CRUDEntity[] | null;
};
export interface UserState extends Omit<State, 'isLoaded'> {
  auth: string | null;
  userData: User | null;
  isLogged: boolean;
  dataLoaded: boolean;
};


// export type UserState = {
//   auth: string | null,
//   userData: User | null,
//   isLogged: boolean,
//   dataLoaded: boolean,
//   error: unknown | null,
// };
// export type OperationsState = {
//   entities: Operation[] | null,
//   isLoaded: boolean,
//   error: unknown | null
// };
// export type CategoriesState = {
//   entities: Category[] | null,
//   isLoaded: boolean,
//   error: unknown | null
// };
// export type AccountsState = {
//   entities: Account[] | null,
//   isLoaded: boolean,
//   error: unknown | null
// };
// export type GoalsState = {
//   entities: Goal[] | [] | null,
//   isLoaded: boolean,
//   error: unknown | null
// };

// export type CrudData = Operation | Category | Account | Goal | null;
// export type CrudDataState =  {
//   entities: CrudData[] | null,
//   isLoaded: boolean,
//   error: unknown | null
// };