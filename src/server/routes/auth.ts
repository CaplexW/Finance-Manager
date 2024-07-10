import { Request, Response, Router } from 'express';
import User, { IUser } from '../models/User.ts';
import cryptService from '../services/crypt.service.ts';
import tokenService from '../services/token.service.ts';
import { redLog } from '../../utils/console/coloredLogs.ts';
import Category, { ICategory } from '../models/Category.ts';
import validatorService from '../services/validator.service.ts';
import { JwtPayload } from 'jsonwebtoken';
import sendCredentialsError from '../../utils/errors/fromServerToClient/sendCredentialsError.ts';
import serverError from '../../utils/errors/fromServerToClient/serverError.ts';
import { sendNotFound } from '../../utils/errors/fromServerToClient/sendNotFound.ts';
import showElement from '../../utils/console/showElement.ts';
import { IToken } from '../models/Token.ts';

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

async function signUp(req: Request, res: Response) {
    const thisPlace = 'auth/signUp';
    try {
        const errors = getResult(req);
        if (!errors.isEmpty()) return sendCredentialsError(res, errors);
        const { email, password } = req.body;
        const userExists: boolean = Boolean(await User.findOne({ email }));
        if (userExists) return sendEmailExistsError(res);

        const hashedPassword: string = await cryptService.hash(password, 12);
        const defaultCategoriesList: ICategory[] = await Category.find({ user: undefined });
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
    try {
        const { refresh_token: refreshToken } = req.body;
        const data = tokenService.validateRefresh(refreshToken) as JwtPayload;
        const dbToken = await tokenService.findToken(refreshToken) as IToken;
        const tokenIsInvalid = (!data || !dbToken || data._id !== dbToken?.user?.toString());
        if (tokenIsInvalid) return sendTokenError(res);

        const tokens = tokenService.generate({ _id: data._id });
        await tokenService.save(data._id, tokens.refreshToken);

        res.status(201).send({ ...tokens, userId: data._id });

    } catch (e) {
        redLog(e);
        serverError(res, thisPlace);
    }

    function sendTokenError(response: Response) {
        return response.status(401).json({ message: "Token is invalid" });
    }
}

export default router;
