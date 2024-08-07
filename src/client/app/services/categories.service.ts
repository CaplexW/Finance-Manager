import { Category, CrudService, RemoveResult } from "../../../types/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../utils/console/showElement";
import httpService from "./http.service";

const categoryEndpoint = 'category/';

const categoriesService: CrudService<Category> = {
  async getList(): Promise<Category[]> {
    const { data } = await httpService.get(categoryEndpoint);
    showElement(data, 'data');
    return data;
  },
  async update(payload: Category): Promise<Category> {
    const { data } = await httpService.patch(categoryEndpoint, payload);
    return data;
  },
  async create(payload: Category): Promise<Category> {
    const { data } = await httpService.post(categoryEndpoint, payload);
    return data;
  },
  async delete(id: string): Promise<RemoveResult> {
    const { data } = await httpService.delete(categoryEndpoint + id);
    return data;
  }
};

export default categoriesService;

