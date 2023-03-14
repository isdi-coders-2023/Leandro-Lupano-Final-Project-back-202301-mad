import { GuitarsController } from './guitars.controller';
import { NextFunction, Request, Response } from 'express';
import { GuitarStructure } from '../entities/guitar.model';
import { Repo } from '../repositories/repo.interface';

describe('Given the controller GuitarsController', () => {
  const mockRepo = {
    read: jest.fn(),
    readId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    erase: jest.fn(),
    search: jest.fn(),
  } as unknown as Repo<GuitarStructure>;

  const controller = new GuitarsController(mockRepo);

  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  describe('When Post method is called', () => {
    test('Then if the guitar information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        body: {
          brand: 'test',
          modelGuitar: 'test',
        },
      } as unknown as Request;

      await controller.post(req, resp, next);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is no guitar info in the req.body, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          password: 'test',
        },
      } as unknown as Request;

      (mockRepo.create as jest.Mock).mockRejectedValueOnce('No guitar info');
      await controller.post(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
