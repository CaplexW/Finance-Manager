import { Request, Response, Router } from 'express';
import User, { IUser } from '../models/User.ts';
import serverError from '../../utils/errorsToClient/serverError.ts';
import cryptService from '../services/crypt.service.ts';
import tokenService from '../services/token.service.ts';
import { redLog } from '../../utils/console/coloredLogs.ts';
import Category, { ICategory } from '../models/Category.ts';
import validatorService from '../services/validator.service.ts';

const router = Router({ mergeParams: true });
const { getResult, validateEmail, validatePassword } = validatorService;

router.post('/signUp', [validateEmail(), validatePassword(), signUp]);

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
            password: hashedPassword,
            categories: defaultCategoriesList,
            accounts: [],
            currentBalance: 0,
            ...req.body,
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

export default router;
