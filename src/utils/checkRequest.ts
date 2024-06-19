import { Request } from "express";

export default function (request: Request, requestModel: string[]): boolean {
  const requestIsOk = requestModel.every((key) => {
    if (key === 'isIncome' && typeof key === 'boolean') return true;
    return Boolean(request.body[key]);
  });
  return requestIsOk;
}
