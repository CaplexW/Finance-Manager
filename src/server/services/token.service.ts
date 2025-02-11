import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import { Document, Types } from "mongoose";
import config from "../../config/config.ts";
import Token, { IToken } from "../../db/models/Token.ts";
import showError from "../../utils/console/showError.ts";

const { ACCESS_KEY, REFRESH_KEY } = config;

const tokenService = {
    generate(payload: { _id: Types.ObjectId }): TToken {
        const accessToken = jsonwebtoken.sign(payload, ACCESS_KEY, { expiresIn: '1h' });
        const refreshToken = jsonwebtoken.sign(payload, REFRESH_KEY);

        return { accessToken, refreshToken, expiresIn: 3600 };
    },
    async save(userId: Types.ObjectId, refreshToken: string): Promise<Document> {
        const token = await Token.findOne({ user: userId });
        if (token) {
            token.refreshToken = refreshToken;
            return token.save();
        }
        return await Token.create({ user: userId, refreshToken });
    },
    async findToken(refreshToken: string): Promise<Document | IToken | null> {
        try {
            return await Token.findOne({ refreshToken });
        } catch (e) {
            return null;
        }
    },
    async removeTokens(userId: Types.ObjectId) {
        await Token.findOneAndDelete({ user: userId });
    },
    validateRefresh(refreshToken: string): string | JwtPayload | null {
        try {
            return jsonwebtoken.verify(refreshToken, REFRESH_KEY);
        } catch (e) {
            showError(e);
            return null;
        }
    },
    validateAccess(accessToken: string): string | JwtPayload | null {
        try {
            return jsonwebtoken.verify(accessToken, ACCESS_KEY);
        } catch (e) {
            showError(e);
            return null;
        }
    },
};

export default tokenService;

type TToken = {
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
};