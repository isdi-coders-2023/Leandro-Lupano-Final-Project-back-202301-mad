import { Router as router } from 'express';
import { GuitarsController } from '../controllers/guitars.controller.js';
import { GuitarsMongoRepo } from '../repositories/guitars.mongo.repo.js';
import createDebug from 'debug';

const debug = createDebug('GW:router');
debug('guitars-router');

export const guitarsRouter = router();
const guitarsRepo = new GuitarsMongoRepo();
const controller = new GuitarsController(guitarsRepo);

guitarsRouter.post('/create', controller.post.bind(controller));
