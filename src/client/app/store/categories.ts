import { Category } from "../../../types/types";
import categoriesService from "../services/categories.service";
import { createCrudFunctions, createCrudGetters, createCrudSlice } from "./crudReducers.ts";

const storeName = 'categories';

const operationsSlice = createCrudSlice<Category>(storeName);
const { reducer: categoriesReducer, actions } = operationsSlice;

export const {
  loadData: loadCategories,
  createData: createCategories,
  updateData: updateCategories,
  deleteData: deleteCategories
} = createCrudFunctions<Category>(actions, categoriesService); //TODO Устранить ошибку когда разберусь с дженериками.
export const {
  getList: getCategoriesList,
  getLoadStatus: getCategoriesLoadStatus,
  getElementById: getCategoryById,
} = createCrudGetters<Category>(storeName);

export default categoriesReducer;