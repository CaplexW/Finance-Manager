import { Types } from "mongoose";
import Icon from "../server/models/Icon.ts";
import { cyanLog } from "./console/coloredLogs.ts";
import showElement from "./console/showElement.ts";

export default async function getIconByIdname(idName:string):Promise<Types.ObjectId> {
  cyanLog(`start to looking for icon with name ${idName}`);
  const [iconId] = await Icon.find({ name: idName });
  showElement(iconId, 'iconId found');
  return iconId._id;
}