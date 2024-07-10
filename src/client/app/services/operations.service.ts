import { Operation, RemoveResult } from "../../../types/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../utils/console/showElement";
import httpService from "./http.service";

const operationEndpoint = 'operation/';

const operationsService = {
  async getList(): Promise<Operation[]> {
    const { data } = await httpService.get(operationEndpoint);
    return data;
  },
  async update(payload: Operation): Promise<Operation> {
    const { data } = await httpService.patch(operationEndpoint, payload);
    return data;
  },
  async create(payload: Operation): Promise<Operation> {
    showElement(payload, 'creating from');
    const { data } = await httpService.post(operationEndpoint + 'create', payload);
    return data;
  },
  async delete(id: string): Promise<RemoveResult> {
    const { data } = await httpService.delete(operationEndpoint + id);
    return data;
  }
};

export default operationsService;
