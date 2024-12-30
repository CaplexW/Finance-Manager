import express, { Response } from 'express';
import { AuthedRequest, checkAuth } from '../middleware/auth.middleware.ts';
import getDataOfUser from '../../utils/getDataOfUser.ts';
import showError from '../../utils/console/showError.ts';
import Goal, { IGoal } from '../../db/models/Goal.ts';
import User from '../../db/models/User.ts';
import { Types } from 'mongoose';
import sendAuthError from '../../utils/errors/fromServerToClient/sendAuthError.ts';
import { sendNotFound } from '../../utils/errors/fromServerToClient/sendNotFound.ts';
import serverError from '../../utils/errors/fromServerToClient/serverError.ts';
import checkRequest from '../../utils/checkRequest.ts';
import sendBadRequest from '../../utils/errors/fromServerToClient/sendBadRequest.ts';

const router = express.Router({ mergeParams: true });

router.get('/', checkAuth, sendList);
router.post('/', checkAuth, create);
router.patch('/', checkAuth, update);
router.delete('/', checkAuth, remove);

async function sendList(req: AuthedRequest, res: Response) {
  const thisPlace = 'goal/sendList';
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    const authedUser = req.user._id;
    const list = await getDataOfUser(authedUser, Goal);
    if (!list) return sendNotFound(res, 'goal', authedUser);

    res.status(200).send(list);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}
async function create(req: AuthedRequest, res: Response) {

  //  request: {
  //    name: string,
  //    goalPoint: number,
  //  }
  const thisPlace = 'goal/create';
  const request = ['name', 'goalPoint'];
  const requestIsOk = checkRequest(req, request);
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    if (!requestIsOk) return sendBadRequest(res, thisPlace);
    const authedUser: string = req.user._id;
    const hostUser = await User.findById(authedUser);
    if (!hostUser) return sendNotFound(res, 'user', authedUser);

    const goalData: IGoal = {
      ...req.body, // name, goalPoint
      user: authedUser,
      status: 'in progress',
    };
    const createdGoal = await Goal.create(goalData);
    await createdGoal.save();
    hostUser.goals.push(createdGoal._id);
    hostUser.save();

    res.status(201).send(createdGoal);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}
async function update(req: AuthedRequest, res: Response) {

  //  request: {
  //   _id: string,
  //   user: string,
  //   name?: string,
  //   status?: enum-strings,
  //   goalPoint?: number,
  // }
  const thisPlace = 'goal/update';
  const request = ['_id', 'user'];
  const requestIsOk = checkRequest(req, request);
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    if (!requestIsOk) return sendBadRequest(res, thisPlace);
    const isPermitted: boolean = req.user._id === req.body.user;
    if (!isPermitted) return sendAuthError(res, thisPlace, req.user._id);
    const updatingGoal = await Goal.findById(req.body._id);
    if (!updatingGoal) return sendNotFound(res, 'goal', req.body._id);

    const result = await updatingGoal.updateOne(req.body, { new: true });
    await updatingGoal.save();

    res.status(200).send(result);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }

}
async function remove(req: AuthedRequest, res: Response) {

  // requestBody: {
  //  _id: string,
  //  user: string,
  // }
  const thisPlace = 'goal/remove';
  const request = ['_id', 'user'];
  const requestIsOk = checkRequest(req, request);
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    if (!requestIsOk) return sendBadRequest(res, thisPlace);
    const goalId: string = req.body._id;
    const removingGoal = await Goal.findById(goalId);
    if (!removingGoal) return sendNotFound(res, 'goal', goalId);
    const authedId: string = req.user._id;
    const ownerId: Types.ObjectId = removingGoal.user;
    if (!ownerId) return sendNotFound(res, 'user', goalId);
    const isPermitted = (ownerId.toString() === authedId);
    if (!isPermitted) return sendAuthError(res, thisPlace, authedId);
    const hostUser = await User.findById(authedId);
    if (!hostUser) return sendNotFound(res, 'user', authedId);

    const result = await Goal.findByIdAndDelete(goalId);
    const newList = await Goal.find({ user: authedId });
    hostUser.updateOne({ goals: newList }, { new: true });

    res.status(200).send(result);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}


export default router;
