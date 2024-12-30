import express from 'express';
import auth from './auth.ts';
import account from './account.ts';
import category from './category.ts';
import goal from './goal.ts';
import operation from './operation.ts';
import user from './user.ts';
import icon from './icon.ts';

const router = express.Router({ mergeParams: true });

router.use('/auth', auth);
router.use('/user', user);
router.use('/operation', operation);
router.use('/category', category);
router.use('/account', account);
router.use('/goal', goal);
router.use('/icon', icon);

export default router;
