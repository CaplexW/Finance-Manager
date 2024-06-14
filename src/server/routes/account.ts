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

    const hostUser = await User.findById(authedUser);
    if(!hostUser) { sendNotFound(res, 'user', authedUser); return; };

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
      const goalExist = userGoals?.some((goal) => goal.name === req.body.goal);
      let accountsGoal: Document; // TODO найти способ указать тип - goal.
      if (goalExist) {
        const [foundGoal] = await Goal.find({ account: createdAccount._id });
        await hostUser.goals.push(foundGoal._id); 
        accountsGoal = foundGoal;
      } else {
        const goalData = {
          name: req.body.goal.name,
          goalPoint: req.body.goal.goalPoint,
          status: 'in progress',
          user: authedUser,
        };
        const createdGoal = await Goal.create(goalData);
        await hostUser.goals.push(createdGoal._id);
        accountsGoal = createdGoal;
      };
      await accountsGoal.updateOne({ account: createdAccount._id}, { new: true });
      await createdAccount.updateOne({ goal: accountsGoal._id }, { new: true });
    }
    await createdAccount.save();

    hostUser.accounts.push(createdAccount._id);
    hostUser.save();

    const account = await Account.findById(createdAccount._id); //TODO найти способ обновлять документ перед отправкой.
    res.status(201).send(account);
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
  // }

  try {
    if (!req.user) { sendAuthError(res, 'account/update'); return; };
    if (!req.body) { sendNotFound(res, 'Request'); return; };

    const accountId: string = req.body._id;

    const removingAccount = await Account.findById(accountId);
    if (!removingAccount) { sendNotFound(res, 'account', accountId); return; };

    const authedId: string = req.user._id;
    const ownerId: Types.ObjectId = removingAccount.user;

    const isPermitted = (ownerId.toString() === authedId);
    if (!isPermitted) {
      sendAuthError(res, 'account/update', authedId);
      return;
    };

    const hostUser = await User.findById(authedId);
    if (!hostUser) { sendNotFound(res, 'user', authedId); return; };

    const result = await Account.findByIdAndDelete(accountId);
    const [accountGoal] = await Goal.find({ account: accountId });
    if(accountGoal?.account) {
      accountGoal.account = null;
      accountGoal.save(); 
    }

    hostUser.accounts = hostUser.accounts.filter((acc) => acc._id.toString() !== accountId);
    await hostUser.save();
    res.status(200).send(result);
  } catch (err) {
    showError(err);
    serverError(res, 'account/remove');
  }
}


export default router;
