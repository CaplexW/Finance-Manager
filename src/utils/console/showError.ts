import { redLog } from "./coloredLogs.ts";

export default function showError(message:unknown) {
  redLog(`ERROR OCCURRED: `);
  console.log(message);
}
