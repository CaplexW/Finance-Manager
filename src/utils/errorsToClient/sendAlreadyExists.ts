import { Response } from "express";

export function sendAlreadyExists(response: Response, object: string, key: string, id: string = '') {
  const message: string =
    id ?
      `${object} with ${key} ${id} is already exists`
      : `${object} not found`;
  response.status(404).send({ message });
}