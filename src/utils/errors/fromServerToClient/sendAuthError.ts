import { Response } from "express";
import { redLog } from "../../console/coloredLogs.ts";

export default function(response: Response, place:string | null = null, id:string | null = null) {
    response.status(401).json({ message: 'Ошибка авторизации' });
    if(place) {
        const log = id ? `error occured in ${place} for user ${id}` : `error occured in ${place}`;
        redLog(log);
    }
}
