import express, { Response } from 'express';
import { AuthedRequest, checkAuth } from '../middleware/auth.middleware.ts';
import Account, { IAccount } from '../../db/models/Account.ts';
import getDataOfUser from '../../utils/getDataOfUser.ts';
import showError from '../../utils/console/showError.ts';
import Goal from '../../db/models/Goal.ts';
import { Document } from 'mongoose';
import User from '../../db/models/User.ts';
import sendAuthError from '../../utils/errors/fromServerToClient/sendAuthError.ts';
import { sendNotFound } from '../../utils/errors/fromServerToClient/sendNotFound.ts';
import serverError from '../../utils/errors/fromServerToClient/serverError.ts';
import checkRequest from '../../utils/checkRequest.ts';
import sendBadRequest from '../../utils/errors/fromServerToClient/sendBadRequest.ts';
import sendForbidden from '../../utils/errors/fromServerToClient/sendForbidden.ts';

const router = express.Router({ mergeParams: true });

router.get('/', checkAuth, sendList);
router.post('/create', checkAuth, create);
router.patch('/update', checkAuth, update);
router.delete('/remove', checkAuth, remove);

async function sendList(req: AuthedRequest, res: Response) {
  const thisPlace = 'account/sendList';
  try {
    if (!req.user) return sendAuthError(res, thisPlace);

    const authedUser = req.user._id;
    const list = await getDataOfUser(authedUser, Account);
    if (!list) return sendNotFound(res, 'account', authedUser);

    res.status(200).send(list);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
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
  const request = ['name', 'type'];
  const thisPlace: string = 'account/create';
  const requestIsOk = checkRequest(req, request);
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    if (!requestIsOk) return sendBadRequest(res, thisPlace);
    const authedUser: string = req.user._id;
    const hostUser = await User.findById(authedUser);
    if (!hostUser) return sendNotFound(res, 'user', authedUser);
    const accountData: IAccount = {
      ...req.body, // name, type percent
      currentBalance: 0,
      user: authedUser,
      goal: null
    };
    const createdAccount = await Account.create(accountData);

    if (req.body.goal) {
      const userGoals = await getDataOfUser(authedUser, Goal);
      const goalExist = userGoals?.some((goal) => goal.name === req.body.goal);
      let accountsGoal: Document; // TODO найти способ указать точный тип - goal.
      if (goalExist) {
        const [foundGoal] = await Goal.find({ account: createdAccount._id });
        hostUser.goals.push(foundGoal._id);
        accountsGoal = foundGoal;
      } else {
        const goalData = {
          name: req.body.goal.name,
          goalPoint: req.body.goal.goalPoint,
          status: 'in progress',
          user: authedUser,
        };
        const createdGoal = await Goal.create(goalData);
        hostUser.goals.push(createdGoal._id);
        accountsGoal = createdGoal;
      };
      await accountsGoal.updateOne({ account: createdAccount._id });
      await createdAccount.updateOne({ goal: accountsGoal._id }, { new: true });
    }
    await createdAccount.save();
    hostUser.accounts.push(createdAccount._id);
    hostUser.save();

    //TODO проверить является ли createdAccount обновленным.
    res.status(201).send(createdAccount);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}
async function update(req: AuthedRequest, res: Response) {
  const thisPlace: string = 'account/update';
  //  request: {
  //   _id: string,
  //   user: string,
  //   name?: string,
  //   type?: enum-strings,
  //   percent?: number,
  //   goal?: string,
  //   currentBalance?: number,
  // }
  const request = ['_id', 'user'];
  const requestIsOk = checkRequest(req, request);
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    if (!requestIsOk) return sendBadRequest(res, thisPlace);
    const authedUser: string = req.user._id;
    const ownerUser: string = req.body._id;
    if (!(authedUser === ownerUser)) return sendForbidden(res, thisPlace);

    const updatingAccount = await Account.findById(req.body._id);
    if (!updatingAccount) return sendNotFound(res, 'account', req.body._id);
    const updatedAccount = await updatingAccount.updateOne(req.body, { new: true });

    res.status(200).send(updatedAccount);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }

}
async function remove(req: AuthedRequest, res: Response) {
  // requestBody: {
  //  _id: string,
  // }
  const thisPlace: string = 'account/remove';
  const request = ['_id'];
  const requestIsOk = checkRequest(req, request);
  try {
    // TODO Найти способ вынести проверки в отдельную абстракцию
    if (!req.user) return sendAuthError(res, thisPlace);
    if (!requestIsOk) return sendBadRequest(res, thisPlace);
    const accountId: string = req.body._id;
    const removingAccount = await Account.findById(accountId);
    if (!removingAccount) return sendNotFound(res, 'account', accountId);
    const authedId: string = req.user._id;
    const ownerId: string = removingAccount.user.toString();
    if (!(ownerId === authedId)) return sendAuthError(res, thisPlace, authedId);
    const hostUser = await User.findById(authedId);
    if (!hostUser) return sendNotFound(res, 'user', authedId);

    const result = await Account.findByIdAndDelete(accountId);
    const [accountGoal] = await Goal.find({ account: accountId });
    if (accountGoal?.account) {
      accountGoal.account = null;
      accountGoal.save();
    }
    hostUser.accounts = hostUser.accounts.filter((acc) => acc._id.toString() !== accountId);
    await hostUser.save();

    res.status(200).send(result);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}


export default router;
