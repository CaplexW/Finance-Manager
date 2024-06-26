import { User } from "../../../types/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../utils/console/showElement";
import httpService from "./http.service";

const userEndpoint = 'user/';

const userService = {
  async getById(id: string): Promise<{ content: User }> {
    const { data } = await httpService.get(userEndpoint + id);
    return data;
  },
};

export default userService;
