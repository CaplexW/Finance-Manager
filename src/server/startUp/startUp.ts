import config from "../../config/config.ts";

export default function startUp():void {
  console.log(`Server is started on port ${config.PORT}`);
  console.log(`You can reach it on url ${config.URL}`);
}