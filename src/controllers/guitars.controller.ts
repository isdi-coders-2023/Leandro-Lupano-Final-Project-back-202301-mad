import { Repo } from '../repositories/repo.interface';
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { GuitarStructure } from '../entities/guitar.model';

const debug = createDebug('GW:guitars-controller');

export class GuitarsController {
  constructor(public guitarsRepo: Repo<GuitarStructure>) {
    this.guitarsRepo = guitarsRepo;

    debug('guitars-controller-instanced');
  }

  async post(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('post-method');

      // PASO DE VERIFICACIÓN CON JOI O "OR" PARA TODAS LAS PROPIEDADES DE LAS GUITARRAS:
      // if (!req.body) throw new HTTPError(401, 'Unauthorized', 'Invalid guitar properties');

      const newGuitar = req.body;

      const data = await this.guitarsRepo.create(newGuitar);

      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }
}
