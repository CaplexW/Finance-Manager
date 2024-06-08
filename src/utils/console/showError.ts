import config from "../../config/config.ts";

export default function showError(message:string) {
  if(!config.IN_PRODUCTION) {
    console.error(message);
  }
}
