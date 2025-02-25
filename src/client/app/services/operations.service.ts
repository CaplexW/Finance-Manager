import { Operation } from "../../../types/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../utils/console/showElement";
import displayError from "../utils/errors/onClient/displayError";
import { createCRUDServiceFunctions } from "./crud.service";
import httpService from "./http.service";

const operationEndpoint = 'operation/';

const {
  getList,
  create,
  update,
  remove,
} = createCRUDServiceFunctions<Operation>(operationEndpoint);


const operationsService = {
  getList,
  create,
  update,
  delete: remove,

  async uploadCSV(payload: FormData, dataSource: string) {
    let methodEndpoint;
    if (dataSource === 'tinkoff') methodEndpoint = 'upload/csv/tinkoff';
    if (!methodEndpoint) return displayError('Не могу определить банк!');
    const URL = operationEndpoint + methodEndpoint;
    const { data } = await httpService.post(URL, payload);
    return data;
  },
};

export default operationsService;
