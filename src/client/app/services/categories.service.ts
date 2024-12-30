import { Category, CRUDService } from "../../../types/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../utils/console/showElement";
import { createCRUDServiceFunctions } from "./crud.service";
import httpService from "./http.service";

const categoryEndpoint = 'category/';

const { 
  create,
  remove,
  update,
  getList
} = createCRUDServiceFunctions<Category>(categoryEndpoint);

const categoriesService: CRUDService<Category> = {
  create,
  remove,
  update,
  getList,
};

export default categoriesService;

