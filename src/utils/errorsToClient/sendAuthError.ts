import { Response } from "express";
import { redLog } from "../console/coloredLogs.ts";

export default function(response: Response, place:string, id:string | null = null) {
    const log = id ? `error occured in ${place} for user ${id}` : `error occured in ${place}`;

    response.status(401).json({ message: 'Доступ запрещен' });
    redLog(log);
}