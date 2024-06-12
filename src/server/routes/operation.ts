import express, { Response } from 'express';
import { AuthedRequest, checkAuth } from '../middleware/auth.middleware.ts';
import Operation, { IOperation } from '../models/Operation.ts';
import { getDisplayDate } from '../../utils/formatDate.ts';
import showError from '../../utils/console/showError.ts';
import serverError from '../../utils/errorsToClient/serverError.ts';
import sendAuthError from '../../utils/errorsToClient/sendAuthError.ts';
import User, { IUser } from '../models/User.ts';
import Category from '../models/Category.ts';
import calculateAmount from '../../utils/calculateAmount.ts';

const router = express.Router({ mergeParams: true });

router.get('/', checkAuth, sendList);
router.post('/create', checkAuth, create);
router.patch('/update', checkAuth, update);
router.delete('/remove', checkAuth, remove);

async function sendList(req: AuthedRequest, res: Response) {
  try {
    const list = await Operation.find({ user: req.user?._id });
    res.status(200).send(list);
  } catch (err) {
    showError(err);
    serverError(res, 'user/update');
  }
}
async function create(req: AuthedRequest, res: Response) {
  try {
    if (!req.body) { sendNotFound(res, 'Request'); return; };

    const categoryId: string = req.body.category;
    const authedUserId: string = req.user?._id;

    const operationCategory = await Category.findById(categoryId);
    if (!operationCategory) { sendNotFound(res, 'category', categoryId); return; };
    const operationData: IOperation = {
      ...req.body,
      user: authedUserId,
      amount: await calculateAmount(req.body),
      date: req.body.date ? req.body.date : getDisplayDate(new Date),
    };
    const newOperation = await Operation.create(operationData);
    res.status(201).send(newOperation);
  } catch (err) {
    showError(err);
    serverError(res, 'operation/create');
  }
}
async function update(req: AuthedRequest, res: Response) {
  try {
    if(!req.user) { sendAuthError(res, 'operation/update'); return; };

    const isPermitted: boolean = req.user?._id === req.body.user;
    if (!isPermitted) {
      sendAuthError(res, 'operation/update', req.user._id);
      return;
    };
    const updatedUser = await Operation.findByIdAndUpdate(req.body._id, req.body, { new: true });
    res.status(203).send(updatedUser);
  } catch (err) {
    showError(err);
    serverError(res, 'operation/edit');
  }

}
async function remove(req: AuthedRequest, res: Response) {
  try {
    if(!req.user) { sendAuthError(res, 'operation/update'); return; };

    const operationId: string = req.body._id;

    const removingOperation = await Operation.findById(operationId);
    if (!removingOperation) { sendNotFound(res, 'operation', operationId); return; };

    const userId: string = removingOperation._id.toString();
    const authedId: string = req.user._id;

    const isPermitted: boolean = (authedId === userId) && (authedId !== undefined);
    if (!isPermitted) {
      sendAuthError(res, 'operation/update', authedId);
      return;
    };

    const hostUser: (IUser | null) = await User.findById(userId);
    if (!hostUser) { sendNotFound(res, 'user', userId); return; };

    await Operation.findByIdAndDelete(operationId);
    const newBalance: number = hostUser.currentBalance - removingOperation.amount;
    await User.findByIdAndUpdate(hostUser._id, { currentBalance: newBalance });

    res.status(200).send({ updatedBalance: newBalance });
  } catch (err) {
    showError(err);
    serverError(res, 'operation/remove');
  }
}

function sendNotFound(response: Response, object: string, id: string = '') {
  const message: string = id ? `${object} with id ${id} not found` : `${object} not found`;
  response.status(404).send({ message });
}

export default router;
