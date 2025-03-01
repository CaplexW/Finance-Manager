import express, { Request, Response } from 'express';
import showError from '../utils/console/showError.ts';
import Icon from '../../db/models/Icon.ts';
import { sendNotFound } from '../utils/errors/fromServerToClient/sendNotFound.ts';
import serverError from '../utils/errors/fromServerToClient/serverError.ts';
import showElement from '../utils/console/showElement.ts';

const router = express.Router({ mergeParams: true });

router.get('/', sendList);

async function sendList(req: Request, res: Response) {
  const thisPlace = 'icon/sendList';
  try {
    const list = await Icon.find();
    if (!list) return sendNotFound(res, 'icon');

    res.status(200).send(list);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}

export default router;
