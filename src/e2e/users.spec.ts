import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app.js';
import { dbConnect } from '../db/db.connect.js';
import { UserModel } from '../repositories/users.mongo.model.js';
import { Auth } from '../helpers/auth.js';
import { TokenPayload } from '../helpers/token.payload.interface.js';

const setCollection = async () => {
  const usersMock = [
    {
      username: 'supertest1',
      email: 'test1@supertest.com',
      password: '12345',
      role: 'Admin',
      myGuitars: [],
    },
    {
      username: 'supertest2',
      email: 'test2@supertest.com',
      password: '12345',
      role: 'User',
      myGuitars: [],
    },
  ];

  await UserModel.deleteMany();
  await UserModel.insertMany(usersMock);

  const data = await UserModel.find();

  const usersIdsTest = [data[0].id, data[1].id];

  return usersIdsTest;
};

describe('Given the App with /users path and connected to MongoDB', () => {
  let payload: TokenPayload;
  let token: string;

  beforeEach(async () => {
    await dbConnect();
    const usersIdsTest: string[] = await setCollection();

    payload = {
      id: usersIdsTest[0],
      username: 'supertest1',
      role: 'Admin',
    };

    token = Auth.createJWT(payload);
  });

  afterEach(async () => {
    await mongoose.disconnect();
  });

  describe('When the Post method to /register path is performed', () => {
    test('Then if the information is OK, the status code should be 201', async () => {
      const registerMock = {
        username: 'supertest3',
        email: 'test3@supertest.com',
        password: '12345',
      };

      const response = await request(app)
        .post('/users/register')
        .send(registerMock);

      expect(response.status).toBe(201);
    });

    test('Then if the information is NOK, the status code should be 401', async () => {
      const registerMock = {
        email: 'test3@supertest.com',
      };

      const response = await request(app)
        .post('/users/register')
        .send(registerMock);

      expect(response.status).toBe(401);
    });
  });

  describe('When the Post method to /login path is performed', () => {
    test('Then if the information is OK, the status code should be 202', async () => {
      const loginMock = {
        username: 'supertest4',
        email: 'test4@supertest.com',
        password: '12345',
      };

      await request(app).post('/users/register').send(loginMock);
      const response = await request(app).post('/users/login').send(loginMock);

      expect(response.status).toBe(202);
    });

    test('Then if the information is NOK (miss password), the status code should be 401', async () => {
      const loginMock = {
        username: 'supertest4',
      };
      const response = await request(app).post('/users/login').send(loginMock);

      expect(response.status).toBe(401);
    });

    test('Then if the information is NOK (userName does not exist), the status code should be 401', async () => {
      const loginMock = {
        userName: 'test10',
        password: 'noPass',
      };
      const response = await request(app).post('/users/login').send(loginMock);

      expect(response.status).toBe(401);
    });

    test('Then if the information is NOK (password does not match), the status code should be 401', async () => {
      const loginMock = {
        userName: 'supertest4',
        password: 'noPass',
      };
      const response = await request(app).post('/users/login').send(loginMock);

      expect(response.status).toBe(401);
    });
  });
});
