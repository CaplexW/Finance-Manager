import { JwtPayload } from 'jsonwebtoken';
import tokenService from "../services/token.service.ts";
import { Response, Request, NextFunction } from "express";
import showError from '../../utils/console/showError.ts';
import { redLog } from '../../utils/console/coloredLogs.ts';
import showElement from '../../utils/console/showElement.ts';

export function checkAuth(req: AuthedRequest, res: Response, next:NextFunction) {
    if (req.method === 'OPTIONS') return next();
    try {
        const token = req.headers.authorization?.split(' ')[1];
        showElement(token, 'token');
        if (!token) return authCheckError('token');
        const authData = tokenService.validateAccess(token) as (JwtPayload | null);
        showElement(authData, 'authData');
        if(!authData) return authCheckError('authData');

        req.user = authData;
        next();
    } catch (e) {
        authCheckError('something and fallen to "catch"');
        showError(e);
    }

    function authCheckError(target:string) {
        res.status(401).json({ message: 'Auth check failed' });
        redLog(`Auth check failed, while checking ${target}!`);
    }
}

export interface AuthedRequest extends Request{
    user?: JwtPayload;
}