import { Types } from "mongoose";

export default function excludeElementById(array: Id[], id: Id): Id[] {
  if (array[0]) {
    const result = array.reduce((newArray, item) => {
      if (item !== id) {
        newArray.push(item);
      }
      return newArray;
    }, [] as Id[]);
    return result;
  } else {
    throw new Error("You trying to remove element by id but '_id' prop does not exist on this element");
  }
}

type Id = string | Types.ObjectId;
