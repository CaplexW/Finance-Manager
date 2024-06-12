import { Response } from "express";

export function sendNotFound(response: Response, object: string, id: string = '') {
  const message: string = id ? `${object} with id ${id} not found` : `${object} not found`;
  response.status(404).send({ message });
}