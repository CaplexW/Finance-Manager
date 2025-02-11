import express, { Response } from 'express';
import User from '../../db/models/User.ts';
import tokenService from '../services/token.service.ts';
import { AuthedRequest, checkAuth } from '../middleware/auth.middleware.ts';
import showError from '../../utils/console/showError.ts';
import Operation from '../../db/models/Operation.ts';
import Category from '../../db/models/Category.ts';
import Account from '../../db/models/Account.ts';
import Goal from '../../db/models/Goal.ts';
import sendAuthError from '../../utils/errors/fromServerToClient/sendAuthError.ts';
import sendForbidden from '../../utils/errors/fromServerToClient/sendForbidden.ts';
import { sendNotFound } from '../../utils/errors/fromServerToClient/sendNotFound.ts';
import serverError from '../../utils/errors/fromServerToClient/serverError.ts';
import cryptService from '../services/crypt.service.ts';
import sendCredentialsError from '../../utils/errors/fromServerToClient/sendCredentialsError.ts';
import { cyanLog } from '../../utils/console/coloredLogs.ts';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../utils/console/showElement.ts';

const router = express.Router({ mergeParams: true });

router.patch('/:id', checkAuth, updateUser);
router.delete('/:id', checkAuth, removeUser);
router.get('/', checkAuth, sendUserInfo);

async function updateUser(req: AuthedRequest, res: Response) {
  // requestBody = {
  //   name?: string,
  //   email?: string, // TODO реализовать валидацию нового email
  //   image?: string,
  // }
  const thisPlace = 'user/update';
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    const isPermitted = req.params.id === req.user._id;
    if (!isPermitted) return sendForbidden(res, thisPlace);

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.send(updatedUser);
  } catch (e) {
    showError(e);
    serverError(res, thisPlace);
  }
}
async function removeUser(req: AuthedRequest, res: Response) {
  const thisPlace = 'user/remove';
  try {
    cyanLog('user delete requested');
    if (!req.user) return sendAuthError(res, thisPlace);
    cyanLog('auth check passed');

    const { id } = req.params;
    const removingUser = await User.findById(id);
    if (!removingUser) return sendNotFound(res, "user", id);
    cyanLog('user existence check passed');

    if (!req?.headers?.authorization) return sendForbidden(res, thisPlace);
    const password = req.headers.password?.split(' ')[1];
    showElement(password, 'password');
    showElement(removingUser.password, 'removingUser.pasword');
    const passwordIsOk = await cryptService.compare(password, removingUser.password);
    showElement(passwordIsOk, 'passwordIsOk');
    if (!passwordIsOk) return sendCredentialsError(res);
    cyanLog('password check passed');
    const isPermitted = (id === req.user._id);
    if (!isPermitted) return sendForbidden(res, thisPlace);
    cyanLog('permition check passed');

    const result = await removingUser.deleteOne();
    if (result.deletedCount) {
      await tokenService.removeTokens(removingUser._id);
      await removeUserData(req.user._id);
    }

    res.status(200).send(result);
  } catch (e) {
    showError(e);
    serverError(res, thisPlace);
  }
}
async function sendUserInfo(req: AuthedRequest, res: Response) {
  const thisPlace = 'user/sendUserInfo';
  try {
    if(!req.user) return sendAuthError(res, thisPlace);

    const userInfo = await User.findById(req.user._id);
    if (!userInfo) return sendNotFound(res, 'user', req.user._id);
    const filteredUserInfo = Object.fromEntries(
      Object.entries(userInfo?._doc).filter(([key]) => !['__v', 'password', 'createdAt', 'updatedAt'].includes(key))
    ); 
    // Удаляю ненужные на фронте свойства. Делаю это через ._doc т.к. на самом деле именно там лежат поля пользователя.
    // TS выдает ошибку т.к. _doc скрытое свойство, поэтому его "не существует".
    // TODO найти способ удалить свойства из копии документа перед отправкой не возмущая TS.

    res.status(200).send(filteredUserInfo);
  } catch (err) {
    serverError(res, thisPlace);
    showError(err);
  }
}

async function removeUserData(id: string) {
  const userOperations = await Operation.find({ user: id });
  await Promise.all(userOperations.map((document) => document?.deleteOne()));

  const userCategories = await Category.find({ user: id });
  await Promise.all(userCategories.map((document) => document?.deleteOne()));

  const userAccounts = await Account.find({ user: id });
  await Promise.all(userAccounts.map((document) => document?.deleteOne()));

  const userGoals = await Goal.find({ user: id });
  await Promise.all(userGoals.map((document) => document?.deleteOne()));
}

export default router;
