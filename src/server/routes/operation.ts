import express, { Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import { AuthedRequest, checkAuth } from '../middleware/auth.middleware.ts';
import Operation from '../../db/models/Operation.ts';
import { getDisplayDate } from '../../utils/formatDate.ts';
import showError from '../../utils/console/showError.ts';
import User from '../../db/models/User.ts';
import Category from '../../db/models/Category.ts';
import calculateAmount from '../../utils/calculateAmount.ts';
import checkRequest from '../../utils/checkRequest.ts';
import serverError from '../../utils/errors/fromServerToClient/serverError.ts';
import sendBadRequest from '../../utils/errors/fromServerToClient/sendBadRequest.ts';
import sendForbidden from '../../utils/errors/fromServerToClient/sendForbidden.ts';
import sendAuthError from '../../utils/errors/fromServerToClient/sendAuthError.ts';
import showElement from '../../utils/console/showElement.ts';
import extractDataFromCSV from '../../utils/import/extractDataFromCSV.ts';
import createOperationFromTinkoffData from '../../utils/import/createOperationFromTinkoffData.ts';

const router = express.Router({ mergeParams: true });
const upload = multer({ dest: './src/server/uploads' });

router.get('/', checkAuth, sendList);
router.post('/create', checkAuth, create);
router.post('/upload/csv/tinkoff', checkAuth, upload.single('file'), importCSVTinkoff);
router.patch('/', checkAuth, update);
router.delete('/:operationId', checkAuth, remove);

async function sendList(req: AuthedRequest, res: Response) {
  const thisPlace = 'operation/sendList';
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    const list = await Operation.find({ user: req.user._id });
    res.status(200).send(list);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}
async function create(req: AuthedRequest, res: Response) {
  // request = {
  //   name: string,
  //   amount: number,
  //   category: string,
  //   date?: string,
  // }
  const thisPlace = 'operation/create';
  const requestBody = ['name', 'amount', 'category'];
  const requestIsOk = checkRequest(req, requestBody);
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
    const hostUser = await User.findById(newOperation.user);
    if (hostUser) {
      hostUser.operations.push(newOperation._id);
      await hostUser.updateOne({ currentBalance: hostUser.currentBalance + newOperation.amount });
      await hostUser.save();
    }

    res.status(201).send(newOperation);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}
async function importCSVTinkoff(req: AuthedRequest, res: Response) {
  const thisPlace = 'operation/import/csv/tinkoff';

  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    if (!req.file) return sendNotFound(res, 'imported file');

    const authedUser = req.user._id;
    const rawData = await extractDataFromCSV(req.file);
    if (!rawData) return serverError(res, 'rawData');

    rawData.shift();
    const operationsArray = await createOperationFromTinkoffData(rawData);
    const result = await Promise.all(operationsArray.map(async (operationData) => {
      operationData.user = authedUser;
      const operation = await Operation.create(operationData);
      return operation;
    }));

    res.status(200).send(result);
    fs.rm(req.file.path, showElement);
  } catch (err) {
    showElement(err, 'err');
    serverError(res, 'operation/import');
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
    const currentOperation = await Operation.findById(req.body._id);
    if (!currentOperation) return sendNotFound(res, 'operation', req.body._id);
    const hostUser = await User.findById(authedUser);
    if (!hostUser) return sendNotFound(res, 'user', authedUser);

    const balanceDifference = Number(req.body.amount) - currentOperation.amount;
    const newData = { ...req.body, amount: await calculateAmount(req.body) };
    const updatedOperation = await Operation.findByIdAndUpdate(req.body._id, newData, { new: true });
    await hostUser.updateOne({ currentBalance: hostUser.currentBalance + balanceDifference });
    // await hostUser.save();

    res.status(203).send(updatedOperation);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }

}
async function remove(req: AuthedRequest, res: Response) {
  const thisPlace = 'operation/remove';
  const { operationId } = req.params;
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    const removingOperation = await Operation.findById(operationId);
    if (!removingOperation) return sendNotFound(res, 'operation', operationId);
    const ownerId = removingOperation.user.toString();
    const authedId = req.user._id;
    const isPermitted = (authedId === ownerId);
    if (!isPermitted) sendForbidden(res, thisPlace);
    const hostUser = await User.findById(ownerId);
    if (!hostUser) return sendNotFound(res, 'user', ownerId);

    const result = await removingOperation.deleteOne();
    const filtered = hostUser.operations.filter((op) => op.toString() !== operationId);
    showElement(filtered, 'filtered');
    const newBalance: number = hostUser.currentBalance - removingOperation.amount;
    await hostUser.updateOne({ currentBalance: newBalance, operations: filtered });
    // await User.findByIdAndUpdate(hostUser._id, { currentBalance: newBalance, operations: filtered });

    res.status(200).send({ result: result.deletedCount, newBalance });
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
