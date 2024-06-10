import { Response } from "express";
import { redLog } from "../console/coloredLogs.ts";

export default function(response: Response, place:string) {
    response.status(401).json({ message: 'Доступ запрещен' });
    redLog(`error occured in ${place}`);
}