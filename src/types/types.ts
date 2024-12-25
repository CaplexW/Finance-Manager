export type Credentials = { email: string, password: string };
export type RegisterPayload = { email: string, password: string, name: string };
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
export type UserState = {
  auth: string | null,
  userData: User | null,
  isLogged: boolean,
  dataLoaded: boolean,
  error: unknown | null,
};
export type OperationsState = {
  entities: Operation[],
  isLoaded: boolean,
};
export type GlobalState = {
  user: UserState,
  operation: OperationsState,
};
export type GetStateFuncion = () => GlobalState;