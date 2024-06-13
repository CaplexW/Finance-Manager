import express, { Response } from 'express';
import { AuthedRequest, checkAuth } from '../middleware/auth.middleware.ts';
import sendAuthError from '../../utils/errorsToClient/sendAuthError.ts';
import Account, { IAccount } from '../models/Account.ts';
import { sendNotFound } from '../../utils/errorsToClient/sendNotFound.ts';
import getDataOfUser from '../../utils/getDataOfUser.ts';
import showError from '../../utils/console/showError.ts';
import serverError from '../../utils/errorsToClient/serverError.ts';
import Goal from '../models/Goal.ts';
import { Document } from 'mongoose';
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
    const list = await getDataOfUser(authedUser, Account);
    if (!list) { sendNotFound(res, 'account', authedUser); return; };

    res.status(200).send(list);
  } catch (err) {
    showError(err);
    serverError(res, 'account/sendList');
  }
}
async function create(req: AuthedRequest, res: Response) {

  //  request: {
  //   name: string,
  //   type: enum-strings,
  //   percent?: number,
  //   goal?: {
  //    name: string,
  //    goalPoint: number
  //   },
  // }

  try {
    if (!req.user) { sendAuthError(res, 'account/create'); return; };
    if (!req.body) { sendNotFound(res, 'Request'); return; };

    const authedUser: string = req.user._id;

    const accountData: IAccount = {
      ...req.body, // name, type percent
      currentBalance: 0,
      user: authedUser,
      goal: null
    };
    const createdAccount = await Account.create(accountData);

    const containsGoal = Boolean(req.body.goal);
    if (containsGoal) {
      const userGoals = await getDataOfUser(authedUser, Goal);
      const goalExist = userGoals?.some((goal) => goal.name = req.body.goal);

      let accountsGoal: Document;
      if (goalExist) {
        [accountsGoal] = await Goal.find({ account: createdAccount._id });
      } else {
        accountsGoal = await createGoal(req.body.goal);
      };
      await createdAccount.updateOne({ goal: accountsGoal._id });
    }
    await createdAccount.save();

    await User.findByIdAndUpdate(authedUser, { accounts: createdAccount }, { new: true });

    res.status(201).send(await getDataOfUser(authedUser, Account));
  } catch (err) {
    showError(err);
    serverError(res, 'account/create');
  }
}
async function update(req: AuthedRequest, res: Response) {

  //  request: {
  //   _id: string,
  //   user: string,
  //   name: string,
  //   type: enum-strings,
  //   percent?: number,
  //   goal?: string,
  //   currentBalance: number,
  // }

  try {
    if (!req.user) { sendAuthError(res, 'account/update'); return; };
    if (!req.body) { sendNotFound(res, 'Request'); return; };

    const isPermitted: boolean = req.user._id === req.body.user;
    if (!isPermitted) {
      sendAuthError(res, 'account/update', req.user._id);
      return;
    };

    const updatingAccount = await Account.findById(req.body._id);
    if (!updatingAccount) { sendNotFound(res, 'account', req.body._id); return; };

    await updatingAccount.updateOne(req.body, { new: true });
    await updatingAccount.save();
    const updatedAccount = await Account.findById(updatingAccount._id);
    res.status(203).send(updatedAccount);
  } catch (err) {
    showError(err);
    serverError(res, 'account/update');
  }

}
async function remove(req: AuthedRequest, res: Response) {

  // requestBody: {
  //  _id: string,
  //  user: string,
  // }

  try {
    if (!req.user) { sendAuthError(res, 'account/update'); return; };
    if (!req.body) { sendNotFound(res, 'Request'); return; };

    const accountId: string = req.body._id;

    const removingAccount = await Account.findById(accountId);
    if (!removingAccount) { sendNotFound(res, 'category', accountId); return; };

    const authedId: string = req.user._id;
    const ownerId: Types.ObjectId = removingAccount.user;

    const isPermitted = (ownerId.toString() === authedId);
    if (!isPermitted) {
      sendAuthError(res, 'account/update', authedId);
      return;
    };

    const hostUser = await User.findById(authedId);
    if (!hostUser) { sendNotFound(res, 'user', authedId); return; };

    await Account.findByIdAndDelete(accountId);
    const newList = await Account.find({ user: authedId });

    hostUser.updateOne({ accounts: newList }, { new: true });
    res.status(200).send(null);
  } catch (err) {
    showError(err);
    serverError(res, 'category/remove');
  }
}

async function createGoal(goal: { name: string, goalPoint: number }): Promise<Document> {
  const goalData = {
    name: goal.name,
    goalPoint: goal.goalPoint,
    status: 'in progress',
  };
  const result = await Goal.create(goalData);
  return result;
}

export default router;
