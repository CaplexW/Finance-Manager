import { Response } from "express";
import { redLog } from "../console/coloredLogs.ts";
import { Result } from "express-validator";

export default function(response: Response, errors: Result | null = null) {
  const error: error = {
    message: 'INVALID_CREDANTIALS',
    code: 400,
    errors: errors ? errors?.array() : null,
};
  response.status(400).json({ error });
  redLog(error.message);
}

type error = {
  message: string,
  code: number,
  errors?: null | unknown[]
};
