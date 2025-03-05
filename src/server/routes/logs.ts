import express, { Request } from 'express';
import showElement from '../utils/console/showElement.ts';

const router = express.Router({ mergeParams: true });

router.get('/', showLogs);
router.post('/', showLogs);


function showLogs(req: Request) {
  const body = req.body;
  showElement(body, `Body of ${req.method} request`);
}

export default router;
