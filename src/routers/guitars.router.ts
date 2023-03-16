import { Router as router } from 'express';
import { GuitarsController } from '../controllers/guitars.controller.js';
import { GuitarsMongoRepo } from '../repositories/guitars.mongo.repo.js';
import createDebug from 'debug';
import { Interceptors } from '../interceptors/interceptors.js';

const debug = createDebug('GW:router');
debug('guitars-router');

export const guitarsRouter = router();
const guitarsRepo = new GuitarsMongoRepo();
const controller = new GuitarsController(guitarsRepo);

guitarsRouter.post('/create', controller.post.bind(controller));

guitarsRouter.get(
  '/products',
  Interceptors.logged,
  controller.get.bind(controller)
);

guitarsRouter.get(
  '/details/:idGuitar',
  Interceptors.logged,
  controller.getId.bind(controller)
);
