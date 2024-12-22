import express, { Response } from 'express';
import { AuthedRequest, checkAuth } from '../middleware/auth.middleware.ts';
import Operation from '../models/Operation.ts';
import { getDisplayDate } from '../../utils/formatDate.ts';
import showError from '../../utils/console/showError.ts';
import serverError from '../../utils/errorsToClient/serverError.ts';
import sendAuthError from '../../utils/errorsToClient/sendAuthError.ts';
import User from '../models/User.ts';
import Category from '../models/Category.ts';
import calculateAmount from '../../utils/calculateAmount.ts';
import checkRequest from '../../utils/checkRequest.ts';
import sendBadRequest from '../../utils/errorsToClient/sendBadRequest.ts';
import sendForbidden from '../../utils/errorsToClient/sendForbidden.ts';

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
  // request = {
  //   name: string,
  //   amount: number,
  //   category: string,
  // }
  const thisPlace = 'operation/create';
  const body = ['name', 'amount', 'category'];
  const requestIsOk = checkRequest(req, body);
  try {
    if (!requestIsOk) return sendBadRequest(res, thisPlace);
    const categoryId: string = req.body.category;
    const authedownerId: string = req.user?._id;
    const operationCategory = await Category.findById(categoryId);
    if (!operationCategory) return sendNotFound(res, 'category', categoryId);

    const operationData = {
      ...req.body,
      user: authedownerId,
      amount: await calculateAmount(req.body),
      date: req.body.date ? req.body.date : getDisplayDate(new Date),
    };
    const newOperation = await Operation.create(operationData);

    res.status(201).send(newOperation);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}
async function update(req: AuthedRequest, res: Response) {
  // request = {
  //   _id: string,
  //   user: string,
  //   name?: string,
  //   amount?: number,
  //   category?: string,
  // }
  const thisPlace = 'operation/update';
  const body = ['_id', 'user'];
  const requestIsOk = checkRequest(req, body);
  try {
    if (!requestIsOk) return sendBadRequest(res, thisPlace);
    const authedUser = req.user?._id;
    const isPermitted: boolean = authedUser === req.body.user;
    if (!isPermitted) return sendForbidden(res, thisPlace);

    const updatedUser = await Operation.findByIdAndUpdate(req.body._id, req.body, { new: true });

    res.status(203).send(updatedUser);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }

}
async function remove(req: AuthedRequest, res: Response) {
  // request = {
  //   _id: string,
  //   user: string,
  // }
  const thisPlace = 'operation/remove';
  const body = ['_id', 'user'];
  const requestIsOk = checkRequest(req, body);
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    if (!requestIsOk) return sendBadRequest(res, thisPlace);
    const operationId: string = req.body._id;
    const ownerId: string = req.body.user;
    const authedId: string = req.user._id;
    const removingOperation = await Operation.findById(operationId);
    if (!removingOperation) return sendNotFound(res, 'operation', operationId);
    const isPermitted = (authedId === ownerId) && (authedId !== undefined);
    if (!isPermitted) sendForbidden(res, thisPlace);
    const hostUser = await User.findById(ownerId);
    if (!hostUser) return sendNotFound(res, 'user', ownerId);

    const result = await Operation.findByIdAndDelete(operationId);
    const newBalance: number = hostUser.currentBalance - removingOperation.amount;
    await User.findByIdAndUpdate(hostUser._id, { currentBalance: newBalance });

    res.status(200).send({ result, newBalance });
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}

function sendNotFound(response: Response, object: string, id: string = '') {
  const message: string = id ? `${object} with id ${id} not found` : `${object} not found`;
  response.status(404).send({ message });
}

export default router;
