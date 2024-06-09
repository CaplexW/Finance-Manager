import { Response } from "express";
import { redLog } from "../console/coloredLogs.ts";

export default function(response: Response, place:string) {
    response.status(500).json({ message: 'На сервере произошла ошибка. Попробуйте позже.' });
    redLog(`error occured in ${place}`);
}