import { RemoveResult } from "../../../server/types/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../server/utils/console/showElement";
import httpService from "./http.service";

export function createCRUDServiceFunctions<CRUDEntity>(endpoint: string) {
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
    const { data } = await httpService.delete(endpoint + id);
    return data;
  }
  // Метод назван remove т.к. delete зарезервированное слово в JS,
  // однако при определении в объекте сервиса, следует задать delete: remove,
  // для соблюдения косистентности и однородности с Axios.

  return { getList, update, create, remove };
}
