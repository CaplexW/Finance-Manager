import config from "../../config/config.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function showElement(element:any, elementName:string = 'result') {
  if(!config.IN_PRODUCTION) {
    console.log(elementName, ': ', element);
  }
}
