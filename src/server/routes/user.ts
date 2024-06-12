import express, { Response } from 'express';
import User from '../models/User.ts';
import tokenService from '../services/token.service.ts';
import { AuthedRequest, checkAuth } from '../middleware/auth.middleware.ts';
import serverError from '../../utils/errorsToClient/serverError.ts';
import { redLog } from '../../utils/console/coloredLogs.ts';
import showError from '../../utils/console/showError.ts';
import sendAuthError from '../../utils/errorsToClient/sendAuthError.ts';
import { Mongoose, Types } from 'mongoose';
import Operation from '../models/Operation.ts';
import Category from '../models/Category.ts';

const router = express.Router({ mergeParams: true });

router.patch('/:id', checkAuth, updateUser);
router.delete('/:id', checkAuth, removeUser);

async function updateUser(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) { sendAuthError(res, 'req.user'); return; };

    const updateIsAuthorized = req.params.id === req.user._id;
    if (!updateIsAuthorized) { sendAuthError(res, 'user/update', req.user._id); return; }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updatedUser);
  } catch (e) {
    showError(`ERROR OCCURRED: ${e}`);
    serverError(res, 'auth/user/updateUser');
  }
}
async function removeUser(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) { sendAuthError(res, 'user/remove'); return; };
    
    const { id } = req.params;
    const removingUser = await User.findById(id);
    
    if (!removingUser) { { sendNotFoundError(res, id); return; }; }
    const isPermitted = (removingUser._id.toString() === req.user._id);
    if (!isPermitted) return sendAuthError(res, 'user/remove', req.user._id);

    await removeUserData(removingUser._id, Operation);
    await removeUserData(removingUser._id, Category);
    const result = await removingUser.deleteOne();
    if(result.deletedCount === 1) await tokenService.removeTokens(removingUser._id);

    res.status(200).send(result);
  } catch (e) {
    showError(e);
    serverError(res, 'auth/user/removeUser');
  }
}

async function removeUserData(id: Types.ObjectId, model: Mongoose["Model"]) {
  const userData = await model.find({ user: id });
  return await Promise.all(userData.map((document) => document.deleteOne()));
}
function sendNotFoundError(res: Response, id: string) {
  res.status(404).json({ message: `User to rmove not found` });
  redLog(`User with id ${id} not found`);
}

export default router;
