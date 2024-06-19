import express, { Response } from 'express';
import { AuthedRequest, checkAuth } from '../middleware/auth.middleware.ts';
import showError from '../../utils/console/showError.ts';
import serverError from '../../utils/errorsToClient/serverError.ts';
import sendAuthError from '../../utils/errorsToClient/sendAuthError.ts';
import User from '../models/User.ts';
import Category, { ICategory } from '../models/Category.ts';
import { sendNotFound } from '../../utils/errorsToClient/sendNotFound.ts';
import getCategoriesForUser from '../../utils/getCategoriesForUser.ts';
import capitalize from '../../utils/capitalize.ts';
import { sendAlreadyExists } from '../../utils/errorsToClient/sendAlreadyExists.ts';
import checkRequest from '../../utils/checkRequest.ts';
import sendBadRequest from '../../utils/errorsToClient/sendBadRequest.ts';

const router = express.Router({ mergeParams: true });

router.get('/', checkAuth, sendList);
router.post('/create', checkAuth, create);
router.patch('/update', checkAuth, update);
router.delete('/remove', checkAuth, remove);

async function sendList(req: AuthedRequest, res: Response) {
  const thisPlace = 'category/sendList';
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    const list = await getCategoriesForUser(req.user._id);
    if (!list) return sendNotFound(res, 'user', req.user._id);

    res.status(200).send(list);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}
async function create(req: AuthedRequest, res: Response) {

  // requestBody: {
  //  name:string,
  //  isIncome: boolean,
  //  color: string,
  //  icon: ReactElement,
  // }
  const thisPlace = 'category/create';
  const request = ['name', 'isIncome', 'color', 'icon'];
  const requestIsOk = checkRequest(req, request);
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    if (!requestIsOk) return sendBadRequest(res, thisPlace);
    const authedUser: string = req.user._id;
    const userCategories = await getCategoriesForUser(authedUser);
    if (!userCategories) return sendNotFound(res, 'user', authedUser);
    const categoryExists = userCategories.some((category) => category?.name === capitalize(req.body.name));
    if (categoryExists) return sendAlreadyExists(res, 'category', 'name', req.body.name);
    const hostUser = await User.findById(authedUser);
    if (!hostUser) return sendNotFound(res, 'user', authedUser);

    const newCategoryData: ICategory = {
      ...req.body,
      user: hostUser._id,
    };
    const newCategory = await Category.create(newCategoryData);
    userCategories.push(newCategory);
    const updatedCategory = await User.findByIdAndUpdate(authedUser, { categories: userCategories }, { new: true });

    res.status(201).send(updatedCategory);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}
async function update(req: AuthedRequest, res: Response) {

  // requestBody: {
  //  _id: string,
  //  user: string,
  //  name?:string,
  //  isIncome?: boolean,
  //  color?: string,
  //  icon?: ReactElement,
  // }
  const thisPlace = 'category/update';
  const request = ['_id', 'user'];
  const requestIsOk = checkRequest(req, request);
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    if (!requestIsOk) return sendBadRequest(res, thisPlace);
    const isPermitted: boolean = req.user._id === req.body.user;
    if (!isPermitted) return sendAuthError(res, thisPlace, req.user._id);
    const categoryExists = await Category.findById(req.body._id);
    if (!categoryExists) return sendNotFound(res, 'category', req.body._id);

    const updatedCategory = await Category.findByIdAndUpdate(req.body._id, req.body, { new: true });

    res.status(200).send(updatedCategory);
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
  const thisPlace = 'category/remove';
  const request = ['_id', 'user'];
  const requestIsOk = checkRequest(req, request);
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    if (!requestIsOk) return sendBadRequest(res, thisPlace);
    const categoryId: string = req.body._id;
    const removingCategory = await Category.findById(categoryId);
    if (!removingCategory) return sendNotFound(res, 'category', categoryId);
    const authedId: string = req.user._id;
    const ownerId = removingCategory.user;
    const isPermitted = (!ownerId) || (ownerId.toString() === authedId);
    if (!isPermitted) return sendAuthError(res, thisPlace, authedId);
    const hostUser = await User.findById(authedId);
    if (!hostUser) { sendNotFound(res, 'user', authedId); return; };
    const isCustomCategory = Boolean(ownerId);

    let newList;
    if (isCustomCategory) {
      await Category.findByIdAndDelete(categoryId);
      newList = await Category.find({ user: authedId });
    } else {
      const list = await Category.find({ user: authedId });
      newList = list.filter((cat) => cat._id.toString() !== categoryId);
    }
    const result = await User.findByIdAndUpdate(authedId, { categories: newList }, { new: true });

    res.status(200).send(result);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}

export default router;
