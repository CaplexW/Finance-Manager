import { ImportPreset } from "../../types/types";
import { createCRUDServiceFunctions } from "./crud.service";

const importPresetEndpoint = 'import-preset/';

const {
  create,
  getList,
  remove,
} = createCRUDServiceFunctions<ImportPreset>(importPresetEndpoint);

const importPresetService = {
  create,
  getList,
  delete: remove,
};

export default importPresetService;
