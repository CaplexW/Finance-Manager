import { Request, Response, Router } from 'express';
import User, { IUser } from '../../db/models/User.ts';
import cryptService from '../services/crypt.service.ts';
import tokenService from '../services/token.service.ts';
import { cyanLog, redLog } from '../../utils/console/coloredLogs.ts';
import validatorService from '../services/validator.service.ts';
import { JwtPayload } from 'jsonwebtoken';
import sendCredentialsError from '../../utils/errors/fromServerToClient/sendCredentialsError.ts';
import serverError from '../../utils/errors/fromServerToClient/serverError.ts';
import { sendNotFound } from '../../utils/errors/fromServerToClient/sendNotFound.ts';
import { IToken } from '../../db/models/Token.ts';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../utils/console/showElement.ts';
import DefaultCategory, { TDefaultCategory } from '../../db/models/DefaultCategory.ts';

const router = Router({ mergeParams: true });
const { getResult, getValidation } = validatorService;
const singUpValidations = [
    getValidation('email', 'Некорректный email').isEmail(),
    getValidation('password', 'Минимальная длина пароля 8 символов').isLength({ min: 8 }),
];
const signInWithPasswordValidations = [
    getValidation('email', 'Некоректный email').normalizeEmail().isEmail(),
    getValidation('password', 'Нужно ввести пароль').exists(),
];

router.post('/signUp', [...singUpValidations, signUp]);
router.post('/signInWithPassword', [...signInWithPasswordValidations, signInWithPassword]);
router.post('/updateToken', updateToken);

const processingTokens = new Set<string>();

async function signUp(req: Request, res: Response) {
    const thisPlace = 'auth/signUp';
    try {
        const errors = getResult(req);
        if (!errors.isEmpty()) return sendCredentialsError(res, errors);
        const { email, password } = req.body;
        const userExists: boolean = Boolean(await User.findOne({ email }));
        if (userExists) return sendEmailExistsError(res);

        const hashedPassword: string = await cryptService.hash(password, 12);
        const defaultCategoriesList: TDefaultCategory[] = await DefaultCategory.find();
        const newUserData: IUser = {
            image: createUserAvatar(email),
            categories: defaultCategoriesList,
            accounts: [],
            currentBalance: 0,
            operations: [],
            ...req.body, // email, name and password
            password: hashedPassword, // rewrite password
        };
        const newUser = await User.create(newUserData);
        const tokens = tokenService.generate({ _id: newUser._id });
        await tokenService.save(newUser._id, tokens.refreshToken);

        res.status(201).send({ ...tokens, userId: newUser._id });
    } catch (err) {
        redLog(err);
        serverError(res, thisPlace);
    }

    function createUserAvatar(seed: string) {
        return `https://api.dicebear.com/8.x/avataaars/svg?seed=${seed}.svg`;
    }
    function sendEmailExistsError(responseObject: Response) {
        return responseObject.status(400).json({
            error: { message: 'EMAIL_EXISTS', code: 400 }
        });
    }
}
async function signInWithPassword(req: Request, res: Response) {
    const thisPlace = 'auth/SingInWithPassword';
    try {
        const errors = getResult(req);
        if (!errors.isEmpty()) sendCredentialsError(res, errors);
        const { email, password } = req.body;
        const signingUser = await User.findOne({ email });
        if (!signingUser) return sendNotFound(res, 'Email');
        const isPasswordOk = await cryptService.compare(password, signingUser.password);
        if (!isPasswordOk) return sendCredentialsError(res);

        const tokens = tokenService.generate({ _id: signingUser._id });
        await tokenService.save(signingUser._id, tokens.refreshToken);

        res.status(201).send({ ...tokens, userId: signingUser._id });
    } catch (e) {
        redLog(e);
        serverError(res, thisPlace);
    }
}
async function updateToken(req: Request, res: Response) {
    const thisPlace = 'auth/updateToken';
    const { refresh_token: refreshToken } = req.body;
    const user = tokenService.validateRefresh(refreshToken) as JwtPayload;
    if (processingTokens.has(user?._id)) return res.status(429).json({ message: "Token update in progress" });
    processingTokens.add(user._id);
    try {
        const dbToken = await tokenService.findToken(refreshToken) as IToken;

        const tokenIsInvalid = (!user || !dbToken || user._id !== dbToken?.user?.toString());
        if (tokenIsInvalid) {
            processingTokens.delete(user._id);
            return sendTokenError(res);
        }

        const tokens = tokenService.generate({ _id: user._id });
        await tokenService.save(user._id, tokens.refreshToken);

        res.status(201).send({ ...tokens, userId: user._id });

    } catch (e) {
        redLog(e);
        serverError(res, thisPlace);
    } finally {
        processingTokens.delete(user._id);
    }

    function sendTokenError(response: Response) {
        return response.status(401).json({ message: "Token is invalid" });
    }
    function sendTokenIsOutDated(response: Response) {
        return response.status(401).json({ message: "Token is outdated" });
    }
}

export default router;
