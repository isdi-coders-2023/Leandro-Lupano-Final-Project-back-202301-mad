import { Repo } from '../repositories/repo.interface';
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { GuitarStructure } from '../entities/guitar.model';
import { HTTPError } from '../errors/errors.js';

const debug = createDebug('GW:guitars-controller');

export class GuitarsController {
  constructor(public guitarsRepo: Repo<GuitarStructure>) {
    this.guitarsRepo = guitarsRepo;

    debug('guitars-controller-instanced');
  }

  async post(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('post-method');

      const newGuitar = req.body;

      if (req.body.style !== 'Electric' && req.body.style !== 'Acoustic')
        throw new HTTPError(
          400,
          'Wrong guitar type',
          'The guitar type is not Electric neither Acoustic'
        );

      const data = await this.guitarsRepo.create(newGuitar);

      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getForStyle-method');

      const pageString = req.query.page || '1';

      const pageNumber = Number(pageString);

      if (pageNumber < 1 || pageNumber > 5)
        throw new HTTPError(
          400,
          'Wrong page number',
          'The page number in query params is not correct'
        );

      const style = req.query.style || 'All';

      if (style !== 'Electric' && style !== 'Acoustic' && style !== 'All')
        throw new HTTPError(
          400,
          'Wrong style type',
          'The style in query params is not correct'
        );

      let guitarsFiltered: GuitarStructure[];

      if (style === 'All') {
        guitarsFiltered = await this.guitarsRepo.read();
      } else {
        guitarsFiltered = await this.guitarsRepo.search({
          key: 'style',
          value: style,
        });
      }

      const guitarsData = guitarsFiltered.slice(
        (pageNumber - 1) * 5,
        pageNumber * 5
      );

      resp.status(201);
      resp.json({
        results: guitarsData,
      });
    } catch (error) {
      next(error);
    }
  }
}
