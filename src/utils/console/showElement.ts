import config from "../../config/config.ts";

export default function showElement(element:unknown, elementName:string = 'result') {
  if(!config.IN_PRODUCTION) {
    console.log(elementName, ': ', element);
  }
}
