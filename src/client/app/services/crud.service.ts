import { CRUDService, RemoveResult } from "../../../types/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../utils/console/showElement";
import httpService from "./http.service";

export function createCRUDServiceFunctions<CRUDEntity>(endpoint: string): CRUDService<CRUDEntity> {
  async function getList(): Promise<CRUDEntity[]> {
    const { data } = await httpService.get(endpoint);
    return Array.isArray(data) ? data : [];
  }
  async function update(payload: CRUDEntity): Promise<CRUDEntity> {
    const { data } = await httpService.patch(endpoint, payload);
    return data;
  }
  async function create(payload: CRUDEntity): Promise<CRUDEntity> {
    const { data } = await httpService.post(endpoint, payload);
    return data;
  }
  async function remove(id: string): Promise<RemoveResult> {
    const { data } = await httpService.remove(endpoint + id);
    return data;
  }

  return { getList, update, create, remove };
}
