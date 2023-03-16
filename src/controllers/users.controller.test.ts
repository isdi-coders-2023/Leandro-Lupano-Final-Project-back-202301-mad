import { UsersController } from './users.controller';
import { NextFunction, Request, Response } from 'express';
import { UserStructure } from '../entities/user.model';
import { Repo } from '../repositories/repo.interface';
import { Auth } from '../helpers/auth.js';
import { GuitarStructure } from '../entities/guitar.model';

jest.mock('../helpers/auth.js');

describe('Given the controller UsersController', () => {
  const mockUserRepo = {
    read: jest.fn(),
    readId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    erase: jest.fn(),
    search: jest.fn(),
  } as unknown as Repo<UserStructure>;

  const mockGuitarRepo = {} as unknown as Repo<GuitarStructure>;

  const controller = new UsersController(mockUserRepo, mockGuitarRepo);

  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  describe('When Register method is called', () => {
    test('Then if the user information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        body: {
          username: 'test',
          password: 'test',
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(mockUserRepo.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is no username in the body user information, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          password: 'test',
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if there is no password in the body user information, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          username: 'test',
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When Login method is called', () => {
    test('Then if the user information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        body: {
          username: 'test',
          password: 'test',
        },
      } as unknown as Request;

      (mockUserRepo.search as jest.Mock).mockResolvedValue(['test']);

      Auth.compare = jest.fn().mockResolvedValue(true);

      await controller.login(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is no username in the user information, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          password: 'test',
        },
      } as unknown as Request;

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if there is no password in the user information, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          username: 'test',
        },
      } as unknown as Request;

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the user information is complete but the search method return an empty array, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          username: 'test',
          password: 'test',
        },
      } as unknown as Request;

      (mockUserRepo.search as jest.Mock).mockResolvedValue([]);

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the user information is complete but the compare method of Auth return false, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          username: 'test',
          password: 'test',
        },
      } as unknown as Request;

      (mockUserRepo.search as jest.Mock).mockResolvedValue(['test']);

      Auth.compare = jest.fn().mockResolvedValue(false);

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
