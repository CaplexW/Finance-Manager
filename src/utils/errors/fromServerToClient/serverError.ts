import { Response } from "express";
import { redLog } from "../../console/coloredLogs.ts";

export default function(response: Response, target:string) {
    response.status(401).json({ message: "Server error" });
    redLog(`failed in process ${target}`);
}