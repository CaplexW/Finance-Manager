import express, { Response } from 'express';
import User from '../models/User.ts';
import tokenService from '../services/token.service.ts';
import { AuthedRequest, checkAuth } from '../middleware/auth.middleware.ts';
import showError from '../../utils/console/showError.ts';
import Operation from '../models/Operation.ts';
import Category from '../models/Category.ts';
import Account from '../models/Account.ts';
import Goal from '../models/Goal.ts';
import sendAuthError from '../../utils/errors/fromServerToClient/sendAuthError.ts';
import sendForbidden from '../../utils/errors/fromServerToClient/sendForbidden.ts';
import { sendNotFound } from '../../utils/errors/fromServerToClient/sendNotFound.ts';
import serverError from '../../utils/errors/fromServerToClient/serverError.ts';

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
    if (!req.user) return sendAuthError(res, thisPlace);
    const { id } = req.params;
    const isPermitted = (id === req.user._id);
    if (!isPermitted) return sendForbidden(res, thisPlace);
    const removingUser = await User.findById(id);
    if (!removingUser) return sendNotFound(res, "user", id);

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
