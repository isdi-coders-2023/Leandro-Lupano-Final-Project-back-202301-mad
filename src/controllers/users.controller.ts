import { UserStructure } from '../entities/user.model';
import { Repo } from '../repositories/repo.interface';
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/errors.js';
import { Auth, TokenPayload } from '../helpers/auth.js';

const debug = createDebug('GW:users-controller');

export class UsersController {
  constructor(public usersRepo: Repo<UserStructure>) {
    this.usersRepo = usersRepo;

    debug('users-controller-instanced');
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('post-register-method');

      if (!req.body.userName || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid username o password');

      req.body.password = await Auth.hash(req.body.password);

      req.body.myGuitars = [];
      req.body.role = 'User';

      const data = await this.usersRepo.create(req.body);

      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('post-login-method');

      if (!req.body.userName || !req.body.password)
        throw new HTTPError(
          401,
          'Unauthorized',
          'Invalid User Name o password'
        );

      const data = await this.usersRepo.search({
        key: 'userName',
        value: req.body.userName,
      });

      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Username not found');

      if (!(await Auth.compare(req.body.password, data[0].password)))
        throw new HTTPError(401, 'Unauthorized', 'Password does not match');

      const payload: TokenPayload = {
        id: data[0].id,
        userName: data[0].userName,
        role: data[0].role,
      };

      const token = Auth.createJWT(payload);

      resp.status(202);
      resp.json({
        results: [{ token }],
      });
    } catch (error) {
      next(error);
    }
  }
}
