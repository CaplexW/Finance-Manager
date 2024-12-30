import { Category } from "../../../types/types";
import categoriesService from "../services/categories.service";
import { createCRUDFunctions, createCRUDGetters, createCRUDSlice } from "./crudReducers.ts";

const storeName = 'categories';

const operationsSlice = createCRUDSlice<Category>(storeName);
const { reducer: categoriesReducer, actions } = operationsSlice;

export const {
  loadData: loadCategories,
  createData: createCategories,
  updateData: updateCategories,
  deleteData: deleteCategories
} = createCRUDFunctions<Category>(actions, categoriesService);
export const {
  getList: getCategoriesList,
  getLoadStatus: getCategoriesLoadStatus,
  getElementById: getCategoryById,
} = createCRUDGetters(storeName);

export default categoriesReducer;