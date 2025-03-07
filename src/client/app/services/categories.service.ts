import { Category, CRUDService } from "../../../server/types/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../server/utils/console/showElement";
import { createCRUDServiceFunctions } from "./crud.service";

const categoryEndpoint = 'category/';

const { 
  create,
  getList,
  update,
  remove,
} = createCRUDServiceFunctions<Category>(categoryEndpoint);

const categoriesService: CRUDService<Category> = {
  create,
  getList,
  update,
  delete: remove,
};

export default categoriesService;

