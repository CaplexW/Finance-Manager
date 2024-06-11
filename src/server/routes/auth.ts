import { Request, Response, Router } from 'express';
import User, { IUser } from '../models/User.ts';
import serverError from '../../utils/errorsToClient/serverError.ts';
import cryptService from '../services/crypt.service.ts';
import tokenService from '../services/token.service.ts';
import { redLog } from '../../utils/console/coloredLogs.ts';
import Category, { ICategory } from '../models/Category.ts';
import validatorService from '../services/validator.service.ts';
import { JwtPayload } from 'jsonwebtoken';

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
    try {
        const errors = getResult(req);
        if (!errors.isEmpty()) {
            const error = {
                message: 'INVALID_DATA',
                code: 400,
                errors: errors.array(),
            };
            res.status(400).json({ error });
            return;
        }

        const { email, password } = req.body;
        const userExists: boolean = Boolean(await User.findOne({ email }));
        if (userExists) { sendEmailExistsError(res); return; };

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
        serverError(res, 'auth/signUp');
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
    try {
        const errors = getResult(req);
        if (!errors.isEmpty()) {
            const error = {
                message: 'INVALID_DATA',
                code: 400,
                errors
            };
            sendClientError(error);
            return;
        }

        const { email, password } = req.body;
        const signingUser = await User.findOne({ email });
        if (!signingUser) {
            const error = {
                message: "EMAIL_NOT_FOUND",
                code: 400,
            };
            sendClientError(error);
            return;
        }

        const isPasswordOk = await cryptService.compare(password, signingUser.password);
        if (!isPasswordOk) {
            const error = {
                message: 'PASSWORD_IS_INVALID',
                code: 400
            };
            sendClientError(error);
            return;
        }

        const tokens = tokenService.generate({ _id: signingUser._id });
        await tokenService.save(signingUser._id, tokens.refreshToken);

        res.status(201).send({ ...tokens, userId: signingUser._id });
    } catch (e) {
        redLog(e);
        serverError(res, 'auth/SingInWithPassword');
    }

    function sendClientError(error: unknown) {
        return res.status(400).json({ error });
    }
}
async function updateToken(req: Request, res: Response) {
    try{
        const { refresh_token: refreshToken } = req.body;
        const data = tokenService.validateRefresh(refreshToken) as JwtPayload;
        const dbToken = await tokenService.findToken(refreshToken);

        const tokenIsInvalid = (!data || !dbToken || data._id !== dbToken?.user?.toString());
        if (tokenIsInvalid) return sendTokenError(res);

        const tokens = tokenService.generate({ _id: data._id });
        await tokenService.save(data._id, tokens.refreshToken);

        res.status(201).send({ ...tokens, userId: data._id });

    } catch (e) {
        redLog(e);
        serverError(res, 'auth/updateToken');
    }

    function sendTokenError(response:Response) {
        return response.status(401).json({ message: "Token is invalid" });
    }
}

export default router;
