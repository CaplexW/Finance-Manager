import categoriesService from "../services/categories.service";
import { createCrudFunctions, createCrudGetters, createCrudSlice } from "./crudReducers";

const storeName = 'categories';

const operationsSlice = createCrudSlice(storeName);
const { reducer: categoriesReducer, actions } = operationsSlice;

export const {
  loadData: loadCategories,
  createData: createCategories,
  updateData: updateCategories,
  deleteData: deleteCategories
} = createCrudFunctions(actions, categoriesService); //TODO Устранить ошибку когда разберусь с дженериками.
export const {
  getList: getCategoriesList,
  getLoadStatus: getCategoriesLoadStatus,
  getElementById: getCategoryById,
} = createCrudGetters(storeName);

export default categoriesReducer;