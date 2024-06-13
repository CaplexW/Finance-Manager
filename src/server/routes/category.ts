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
import { Types } from 'mongoose';

const router = express.Router({ mergeParams: true });

router.get('/', checkAuth, sendList);
router.post('/create', checkAuth, create);
router.patch('/update', checkAuth, update);
router.delete('/remove', checkAuth, remove);

async function sendList(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) { sendAuthError(res, 'category/sendList'); return; };

    const authedUser = req.user._id;
    const list = await getCategoriesForUser(authedUser);
    if(!list) { sendNotFound(res, 'user', authedUser); return; };

    res.status(200).send(list);
  } catch (err) {
    showError(err);
    serverError(res, 'category/sendList');
  }
}
async function create(req: AuthedRequest, res: Response) {

  // requestBody: {
  //  name:string,
  //  isIncome: boolean,
  //  color: string,
  //  icon: ReactElement,
  // }

  try {
    if (!req.user) { sendAuthError(res, 'category/create'); return; };
    if (!req.body) { sendNotFound(res, 'Request'); return; };

    const authedUser: string = req.user._id;

    const userCategories = await getCategoriesForUser(authedUser);
    if(!userCategories) { sendNotFound(res, 'user', authedUser); return; };

    const categoryExists = userCategories.some((category) => category?.name === capitalize(req.body.name));
    if(categoryExists) { sendAlreadyExists(res, 'category', 'name', req.body.name); return; };

    const hostUser = await User.findById(authedUser);
    if(!hostUser) { sendNotFound(res, 'user', authedUser); return; };

    const newCategoryData:ICategory = {
      ...req.body,
      user: hostUser._id,
    };
    const newCategory = await Category.create(newCategoryData);
    userCategories.push(newCategory);
    await User.findByIdAndUpdate(authedUser, { categories: userCategories }, { new: true });

    res.status(201).send(await getCategoriesForUser(authedUser));
  } catch (err) {
    showError(err);
    serverError(res, 'category/create');
  }
}
async function update(req: AuthedRequest, res: Response) {

  // requestBody: {
  //  _id: string,
  //  name:string,
  //  isIncome: boolean,
  //  color: string,
  //  icon: ReactElement,
  //  user: string,
  // }

  try {
    if (!req.user) { sendAuthError(res, 'category/update'); return; };
    if (!req.body) { sendNotFound(res, 'Request'); return; };
    
    const isPermitted: boolean = req.user._id === req.body.user;
    if (!isPermitted) {
      sendAuthError(res, 'operation/update', req.user._id);
      return;
    };
    
    const categoryExists = await Category.findById(req.body._id);
    if(!categoryExists) { sendNotFound(res, 'category', req.body._id); return; };

    const updatedCategory = await Category.findByIdAndUpdate(req.body._id, req.body, { new: true });
    res.status(203).send(updatedCategory);
  } catch (err) {
    showError(err);
    serverError(res, 'category/update');
  }

}
async function remove(req: AuthedRequest, res: Response) {

  // requestBody: {
  //  _id: string,
  //  user: string,
  // }

  try {
    if (!req.user) { sendAuthError(res, 'category/update'); return; };
    if (!req.body) { sendNotFound(res, 'Request'); return; };

    const categoryId: string = req.body._id;

    const removingCategory = await Category.findById(categoryId);
    if (!removingCategory) { sendNotFound(res, 'category', categoryId); return; };

    const authedId: string = req.user._id;
    const ownerId: Types.ObjectId | null | undefined = removingCategory.user;

    const isPermitted = (!ownerId) || (ownerId.toString() === authedId);
    if (!isPermitted) {
      sendAuthError(res, 'operation/update', authedId);
      return;
    };

    const hostUser = await User.findById(authedId);
    if (!hostUser) { sendNotFound(res, 'user', authedId); return; };

    const isCustomCategory = Boolean(ownerId);
    let newList;

    if(isCustomCategory) {
      await Category.findByIdAndDelete(categoryId);
      newList = await Category.find({ user: authedId });
    } else {
      const list = await Category.find({ user: authedId });
      newList = list.filter((cat) => cat._id.toString() !== categoryId);
    }

    await User.findByIdAndUpdate(authedId, { categories: newList }, { new: true });
    res.status(200).send(null);
  } catch (err) {
    showError(err);
    serverError(res, 'category/remove');
  }
}

export default router;
