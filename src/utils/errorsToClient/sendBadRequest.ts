import { Response } from "express";
import { redLog } from "../console/coloredLogs.ts";

export default function(response: Response, place:string) {
    const message = `Bad request in ${place}`;

    response.status(400).json({ message });
    redLog(message);
}