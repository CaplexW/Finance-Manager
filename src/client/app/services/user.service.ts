import { User } from "../../../types/types";
import { cyanLog } from "../../../utils/console/coloredLogs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../utils/console/showElement";
import httpService from "./http.service";

const userEndpoint = 'user/';

const userService = {
  async getAuthed(): Promise<User> {
    const { data } = await httpService.get(userEndpoint);
    if (!data) throw new Error('user data was not loaded');
    return data;
  }, 
  async deleteUser(userId: string, userPassword: string): Promise<number> {
    const headers = { password: `Bearer ${userPassword}` };
    const response = await httpService.delete(userEndpoint + userId, { headers });

    return response.data.deletedCount;
  }
};

export default userService;
