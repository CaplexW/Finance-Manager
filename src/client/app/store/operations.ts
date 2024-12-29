// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Operation } from "../../../types/types.ts";
import showElement from "../../../utils/console/showElement";
import operationsService from "../services/operations.service";
import { createCrudFunctions, createCrudGetters, createCrudSlice } from "./crudReducers.ts";

const storeName = 'operations';

const operationsSlice = createCrudSlice<Operation>(storeName);
const { reducer: operationsReducer, actions } = operationsSlice;

export const {
  loadData: loadOperations,
  createData: createOperation,
  updateData: updateOperation,
  deleteData: deleteOperation
} = createCrudFunctions(actions, operationsService);
export const {
  getList: getOperationsList,
  getLoadStatus: getOperationsLoadStatus,
} = createCrudGetters(storeName);

export default operationsReducer;
