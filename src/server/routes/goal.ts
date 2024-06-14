import express, { Response } from 'express';
import { AuthedRequest, checkAuth } from '../middleware/auth.middleware.ts';
import sendAuthError from '../../utils/errorsToClient/sendAuthError.ts';
import getDataOfUser from '../../utils/getDataOfUser.ts';
import { sendNotFound } from '../../utils/errorsToClient/sendNotFound.ts';
import showError from '../../utils/console/showError.ts';
import serverError from '../../utils/errorsToClient/serverError.ts';
import Goal, { IGoal } from '../models/Goal.ts';
import User from '../models/User.ts';
import { Types } from 'mongoose';

const router = express.Router({ mergeParams: true });

router.get('/', checkAuth, sendList);
router.post('/create', checkAuth, create);
router.patch('/update', checkAuth, update);
router.delete('/remove', checkAuth, remove);

async function sendList(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) { sendAuthError(res, 'account/sendList'); return; };

    const authedUser = req.user._id;
    const list = await getDataOfUser(authedUser, Goal);
    if (!list) { sendNotFound(res, 'goal', authedUser); return; };

    res.status(200).send(list);
  } catch (err) {
    showError(err);
    serverError(res, 'goal/sendList');
  }
}
async function create(req: AuthedRequest, res: Response) {

  //  request: {
  //    name: string,
  //    goalPoint: number,
  //  }

  try {
    if (!req.user) { sendAuthError(res, 'account/create'); return; };
    if (!req.body) { sendNotFound(res, 'Request'); return; };

    const authedUser: string = req.user._id;

    const goalData: IGoal = {
      ...req.body, // name, goalPoint
      user: authedUser,
      status: 'in progress',
    };
    const createdGoal = await Goal.create(goalData);
    await createdGoal.save();

    const hostUser = await User.findById(authedUser);
    if(!hostUser) { sendNotFound(res, 'user', authedUser); return; };
    hostUser.goals.push(createdGoal._id);
    hostUser.save();

    res.status(201).send(createdGoal);
  } catch (err) {
    showError(err);
    serverError(res, 'account/create');
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

  try {
    if (!req.user) { sendAuthError(res, 'goal/update'); return; };
    if (!req.body) { sendNotFound(res, 'Request'); return; };

    const isPermitted: boolean = req.user._id === req.body.user;
    if (!isPermitted) {
      sendAuthError(res, 'goal/update', req.user._id);
      return;
    };

    const updatingGoal = await Goal.findById(req.body._id);
    if (!updatingGoal) { sendNotFound(res, 'goal', req.body._id); return; };

    await updatingGoal.updateOne(req.body, { new: true });
    await updatingGoal.save();

    const updatedGoal = await Goal.findById(updatingGoal._id);
    res.status(203).send(updatedGoal);
  } catch (err) {
    showError(err);
    serverError(res, 'goal/update');
  }

}
async function remove(req: AuthedRequest, res: Response) {

  // requestBody: {
  //  _id: string,
  //  user: string,
  // }

  try {
    if (!req.user) { sendAuthError(res, 'goal/update'); return; };
    if (!req.body) { sendNotFound(res, 'Request'); return; };

    const goalId: string = req.body._id;

    const removingGoal = await Goal.findById(goalId);
    if (!removingGoal) { sendNotFound(res, 'goal', goalId); return; };

    const authedId: string = req.user._id;
    const ownerId: Types.ObjectId = removingGoal.user;
    if(!ownerId) { sendNotFound(res, 'user', removingGoal.user.toString()); return; };

    const isPermitted = (ownerId.toString() === authedId);
    if (!isPermitted) {
      sendAuthError(res, 'goal/update', authedId);
      return;
    };

    const hostUser = await User.findById(authedId);
    if (!hostUser) { sendNotFound(res, 'user', authedId); return; };

    const result = await Goal.findByIdAndDelete(goalId);
    const newList = await Goal.find({ user: authedId });

    hostUser.updateOne({ goals: newList }, { new: true });
    res.status(200).send(result);
  } catch (err) {
    showError(err);
    serverError(res, 'goal/remove');
  }
}


export default router;
