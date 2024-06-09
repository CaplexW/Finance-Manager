import jsonwebtoken from "jsonwebtoken";
import { Types } from "mongoose";
import config from "../../config/config.ts";
import Token from "../models/Token.ts";

const { ACCESS_KEY, REFRESH_KEY } = config;

const tokenService = {
    generate(payload: { _id: Types.ObjectId }): TToken {
        const accessToken = jsonwebtoken.sign(payload, ACCESS_KEY, { expiresIn: '1h' });
        const refreshToken = jsonwebtoken.sign(payload, REFRESH_KEY);

        return { accessToken, refreshToken, expiresIn: 3600 };
    },
    async save(userId: Types.ObjectId, refreshToken: string) { //TODO does it return anything?
        const data = await Token.findOne({ user: userId });

        if (data) {
            data.refreshToken = refreshToken;
            return data.save();
        }
        return await Token.create({ user: userId, refreshToken });
    },
    async findToken(refreshToken: string) {
        try {
            return await Token.findOne({ refreshToken });
        } catch (e) {
            return null;
        }
    },
    async removeTokens(userId: Types.ObjectId) {
        await Token.findOneAndDelete({ user: userId });
    },
    validateRefresh(refreshToken: string) {
        try {
            return jsonwebtoken.verify(refreshToken, REFRESH_KEY);
        } catch (e) {
            return null;
        }
    },
    validateAccess(accessToken: string) {
        try {
            return jsonwebtoken.verify(accessToken, ACCESS_KEY);
        } catch (e) {
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