// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Operation } from "../../types/types.ts";
import showElement from "../../../server/utils/console/showElement.ts";
import operationsService from "../services/operations.service";
import { createCRUDFunctions, createCRUDGetters, createCRUDSlice } from "./crudReducers.ts";
import displayError from "../utils/errors/onClient/displayError";

const storeName = 'operations';

const operationsSlice = createCRUDSlice<Operation>(storeName);
const { reducer: operationsReducer, actions } = operationsSlice;

const {
  loadData: loadOperations,
  createData: createOperation,
  updateData: updateOperation,
  deleteData: deleteOperation,
  updateState: addOperations,
} = createCRUDFunctions<Operation>(actions, operationsService);

const {
  getList: getOperationsList,
  getLoadStatus: getOperationsLoadStatus,
} = createCRUDGetters<Operation>(storeName);

/**
 * Action для массового обновления категории операций по имени и изначальной категории
 * @param {string} name - Имя операции
 * @param {string} newCategoryId - ID новой категории
 * @param {string} initialCategoryId - ID изначальной категории
 * @returns {Function} - Thunk action
 */
const updateOperationsCategoryByName = (name: string, newCategoryId: string, initialCategoryId: string) => async (dispatch: any) => {
  try {
    const response = await operationsService.updateCategoryByName(name, newCategoryId, initialCategoryId);
    
    if (response.success && response.updatedCount > 0) {
      // Перезагружаем операции, чтобы UI обновился
      dispatch(loadOperations());
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('Ошибка при обновлении категорий операций:', err);
    displayError('Не удалось обновить категории для всех операций');
    return false;
  }
};

export {
  loadOperations,
  createOperation,
  updateOperation,
  deleteOperation,
  addOperations,
  updateOperationsCategoryByName,
};

export {
  getOperationsList,
  getOperationsLoadStatus,
};

export default operationsReducer;