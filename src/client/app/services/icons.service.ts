import { Icon, CRUDService, RemoveResult } from "../../../types/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../utils/console/showElement";
import httpService from "./http.service";

const iconEndpoint = 'icon/';

const iconsService: CRUDService<Icon> = {
  async getList(): Promise<Icon[]> {
    const { data } = await httpService.get(iconEndpoint);
    return Array.isArray(data) ? data : [];
  },
  async update(payload: Icon): Promise<Icon> {
    const { data } = await httpService.patch(iconEndpoint, payload);
    return data;
  },
  async create(payload: Icon): Promise<Icon> {
    const { data } = await httpService.post(iconEndpoint, payload);
    return data;
  },
  async delete(id: string): Promise<RemoveResult> {
    const { data } = await httpService.delete(iconEndpoint + id);
    return data;
  }
};

export default iconsService;

