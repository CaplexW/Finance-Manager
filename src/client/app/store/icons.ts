import { Icon } from "../../types/types.ts";
import iconsService from "../services/icons.service.ts";
import { createCRUDFunctions, createCRUDGetters, createCRUDSlice } from "./crudReducers.ts";

const storeName = 'icons';

const operationsSlice = createCRUDSlice<Icon>(storeName, { emptyEntityIsValid: false });
const { reducer: iconsReducer, actions } = operationsSlice;

export const {
  loadData: loadIcons,
  createData: createIcon,
  updateData: updateIcon,
  deleteData: deleteIcon
} = createCRUDFunctions<Icon>(actions, iconsService);
export const {
  getList: getIconsList,
  getLoadStatus: getIconsLoadStatus,
  getElementById: getIconById,
} = createCRUDGetters(storeName);

export default iconsReducer;