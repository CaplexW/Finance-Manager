import { Icon, CRUDService } from "../../../types/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../utils/console/showElement";
import { createCRUDServiceFunctions } from "./crud.service";
import httpService from "./http.service";

const iconEndpoint = 'icon/';

const {
  create,
  remove,
  update,
  getList
} = createCRUDServiceFunctions<Icon>(iconEndpoint);

const iconsService: CRUDService<Icon> = {
    create,
    remove,
    update,
    getList,
};

export default iconsService;

