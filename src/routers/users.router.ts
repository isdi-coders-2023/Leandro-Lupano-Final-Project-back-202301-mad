import { Router as router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { UsersMongoRepo } from '../repositories/users.mongo.repo.js';
import createDebug from 'debug';

const debug = createDebug('GW:router');
debug('users-router');

export const usersRouter = router();
const usersRepo = new UsersMongoRepo();
const controller = new UsersController(usersRepo);

usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
