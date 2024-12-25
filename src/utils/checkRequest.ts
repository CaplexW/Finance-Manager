import { Request } from "express";
import showElement from "./console/showElement.ts";
import showError from "./console/showError.ts";

export default function (request: Request, requestModel: string[]): boolean {
  const requestIsOk = requestModel.every((key) => {
    if (key === 'isIncome' && typeof request.body[key] === 'boolean') return true;
    return Boolean(request.body[key]);
  });
  if(!requestIsOk) {
    const results = requestModel.map((key) => ({[key]: request.body[key]}));
    showError('Following request did not passed validation:');
    console.log(results);
  }
  return requestIsOk;
}
