import config from "../../../../config/config";

export default function showElement(element:unknown, elementName:string = 'result') {
  if(!config.IN_PRODUCTION) {
    console.log(elementName, ': ', element);
  }
}
