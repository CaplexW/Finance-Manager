import config from "../../config/config.ts";
import { cyanLog, yellowLog } from "../utils/console/coloredLogs.ts";

const { PORT, URL, IN_PRODUCTION } = config;

export default function startUp() {
  if (IN_PRODUCTION) {
    yellowLog(`!!! Server is started on port ${PORT} in production mode!`);
    yellowLog(`You can reach it on url ${URL}`);
  } else {
    cyanLog(`Server is started on port ${PORT} in development mode`);
    cyanLog(`You can reach it on url: "${URL}"`);
  }
  test();
}
async function test() { }
