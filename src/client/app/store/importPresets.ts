import { createCRUDSlice, createCRUDFunctions, createCRUDGetters } from './crudReducers';
import importPresetService from '../services/importPreset.service';
import { ImportPreset } from '../../types/types';

const sliceName = 'importPresets';

const importPresetsSlice = createCRUDSlice<ImportPreset>(sliceName);

const { actions, reducer } = importPresetsSlice;

const {
  loadData: loadImportPresets,
  createData: createImportPreset,
  deleteData: deleteImportPreset,
} = createCRUDFunctions<ImportPreset>(actions, importPresetService);

const {
  getList: getImportPresetsList,
  getLoadStatus: getImportPresetsLoadStatus,
  getElementById: getImportPresetById,
} = createCRUDGetters<ImportPreset>('importPresets');

export {
  reducer as importPresetsReducer,
  loadImportPresets,
  createImportPreset,
  deleteImportPreset,
  getImportPresetsList,
  getImportPresetsLoadStatus,
  getImportPresetById,
};
