import express, { Response } from 'express';
import User from '../models/User.ts';
import tokenService from '../services/token.service.ts';
import { AuthedRequest, checkAuth } from '../middleware/auth.middleware.ts';
import serverError from '../../utils/errorsToClient/serverError.ts';
import showError from '../../utils/console/showError.ts';
import sendAuthError from '../../utils/errorsToClient/sendAuthError.ts';
import Operation from '../models/Operation.ts';
import Category from '../models/Category.ts';
import Account from '../models/Account.ts';
import Goal from '../models/Goal.ts';
import { sendNotFound } from '../../utils/errorsToClient/sendNotFound.ts';
import sendForbidden from '../../utils/errorsToClient/sendForbidden.ts';

const router = express.Router({ mergeParams: true });

router.patch('/:id', checkAuth, updateUser);
router.delete('/:id', checkAuth, removeUser);

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
