import { Router as router } from 'express';
import createDebug from 'debug';

const debug = createDebug('GW:router');

debug('Users Router');

export const usersRouter = router();
