import express, { Response } from 'express';
import User from '../models/User.ts';
import tokenService from '../services/token.service.ts';
import { AuthedRequest, checkAuth } from '../middleware/auth.middleware.ts';
import serverError from '../../utils/errorsToClient/serverError.ts';
import { redLog } from '../../utils/console/coloredLogs.ts';
import showError from '../../utils/console/showError.ts';

const router = express.Router({ mergeParams: true });

router.patch('/:id', checkAuth, updateUser);
router.delete('/:id', checkAuth, removeUser);

async function updateUser(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) { sendAuthError(res, 'req.user'); return; };

    const updateIsAuthorized = req.params.id === req.user._id;
    if (!updateIsAuthorized) { sendAuthError(res, 'updateIsAuthorized'); return; }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updatedUser);
  } catch (e) {
    showError(`ERROR OCCURRED: ${e}`);
    serverError(res, 'auth/user/updateUser');
  }
}
async function removeUser(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) { sendAuthError(res, 'req.user'); return; };
    
    const { id } = req.params;
    const removingUser = await User.findById(id);
    
    if (!removingUser) { { sendNotFoundError(res, id); return; }; }
    const isPermitted = (removingUser._id.toString() === req.user._id);
    if (!isPermitted) return sendAuthError(res, 'isPermitted');
    await User.findByIdAndDelete(removingUser._id);
    await tokenService.removeTokens(removingUser._id);
    // await removeOperations(removingUser._id); // TODO turn on when ready
    // await removeCategories(removingUser._id);
    res.status(200).send(null);
  } catch (e) {
    showError(e);
    serverError(res, 'auth/user/removeUser');
  }
}

function sendAuthError(res: Response, target: string) {
  res.status(401).json({ message: `Auth check failed on ${target}` });
  redLog(`failed on check ${target}`);
}
function sendNotFoundError(res: Response, id: string) {
  res.status(404).json({ message: `User to rmove not found` });
  redLog(`User with id ${id} not found`);
}

export default router;
