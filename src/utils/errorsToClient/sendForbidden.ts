import { Response } from "express";
import { redLog } from "../console/coloredLogs.ts";

export default function(response: Response, place:string) {
    const message = `Forbidden request in ${place}`;

    response.status(403).json({ message });
    redLog(message);
}
