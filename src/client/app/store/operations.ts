// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Operation } from "../../types/types.ts";
import showElement from "../../../server/utils/console/showElement.ts";
import operationsService from "../services/operations.service";
import { createCRUDFunctions, createCRUDGetters, createCRUDSlice } from "./crudReducers.ts";

const storeName = 'operations';

const operationsSlice = createCRUDSlice<Operation>(storeName);
const { reducer: operationsReducer, actions } = operationsSlice;

export const {
  loadData: loadOperations,
  createData: createOperation,
  updateData: updateOperation,
  deleteData: deleteOperation,
  updateState: addOperations,
} = createCRUDFunctions<Operation>(actions, operationsService);
export const {
  getList: getOperationsList,
  getLoadStatus: getOperationsLoadStatus,
} = createCRUDGetters<Operation>(storeName);

export default operationsReducer;
