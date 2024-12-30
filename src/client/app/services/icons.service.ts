import { Icon, CRUDService } from "../../../types/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../utils/console/showElement";
import { createCRUDServiceFunctions } from "./crud.service";

const iconEndpoint = 'icon/';

const {
  create,
  remove,
  update,
  getList
} = createCRUDServiceFunctions<Icon>(iconEndpoint);

const iconsService: CRUDService<Icon> = {
    create,
    update,
    getList,
    delete: remove,
};

export default iconsService;

