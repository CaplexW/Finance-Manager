import { CRUDService, Operation } from "../../../types/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../utils/console/showElement";
import { createCRUDServiceFunctions } from "./crud.service";

const operationEndpoint = 'operation/';

const {
  create,
  getList,
  update,
  remove,
} = createCRUDServiceFunctions<Operation>(operationEndpoint);

const operationsService: CRUDService<Operation> = {
  create,
  getList,
  update,
  remove,
};

export default operationsService;
