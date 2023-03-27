/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app.js';
import { dbConnect } from '../db/db.connect.js';
import { UserModel } from '../repositories/users.mongo.model.js';
import { GuitarModel } from '../repositories/guitars.mongo.model.js';
import { TokenPayload } from '../helpers/token.payload.interface.js';
import { Auth } from '../helpers/auth.js';

const setUserCollection = async () => {
  const usersMock = [
    {
      username: 'supertest1',
      email: 'test1@supertest.com',
      password: await Auth.hash('12345'),
      role: 'Admin',
      myGuitars: [],
    },
    {
      username: 'supertest2',
      email: 'test2@supertest.com',
      password: await Auth.hash('12345'),
      role: 'User',
      myGuitars: [],
    },
  ];

  await UserModel.deleteMany().exec();
  await UserModel.insertMany(usersMock);

  const userData = await UserModel.find().exec();
  const usersIdsTest = [userData[0].id, userData[1].id];

  return usersIdsTest;
};

const setGuitarCollection = async () => {
  const guitarsMock = [
    {
      brand: 'testBrand1',
      modelGuitar: 'testModel1',
      picture: 'testPicture1',
      style: 'testStyle1',
      material: 'testMaterial1',
      price: 1,
      description: 'testDescription1',
    },
    {
      brand: 'testBrand2',
      modelGuitar: 'testModel2',
      picture: 'testPicture2',
      style: 'testStyle2',
      material: 'testMaterial2',
      price: 2,
      description: 'testDescription2',
    },
  ];

  await GuitarModel.deleteMany().exec();
  await GuitarModel.insertMany(guitarsMock);

  const guitarData = await GuitarModel.find().exec();
  const guitarsIdsTest = [guitarData[0].id, guitarData[1].id];

  return guitarsIdsTest;
};

describe('Given the App with /users path and connected to MongoDB', () => {
  let userAdminToken: TokenPayload;
  let userUserToken: TokenPayload;
  let tokenAdminTest: string;
  let tokenUserTest: string;
  let guitarTestId1: string;
  let guitarTestId2: string;

  beforeAll(async () => {
    await dbConnect();

    const usersIdsTest: string[] = await setUserCollection();

    userAdminToken = {
      id: usersIdsTest[0],
      username: 'supertest1',
      role: 'Admin',
    };

    tokenAdminTest = Auth.createJWT(userAdminToken);

    userUserToken = {
      id: usersIdsTest[1],
      username: 'supertest2',
      role: 'User',
    };

    tokenUserTest = Auth.createJWT(userUserToken);

    const guitarsIdsTest: string[] = await setGuitarCollection();
    guitarTestId1 = guitarsIdsTest[0];
    guitarTestId2 = guitarsIdsTest[1];
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('When the Post method to users/register path is performed', () => {
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

  describe('When the Post method to users/login path is performed', () => {
    test('Then if the information is OK, the status code should be 202', async () => {
      const loginMock = {
        username: 'supertest1',
        password: '12345',
      };

      const response = await request(app).post('/users/login').send(loginMock);

      expect(response.status).toBe(202);
    });

    test('Then if the information is NOK (miss password), the status code should be 401', async () => {
      const loginMock = {
        username: 'supertest1',
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
        userName: 'supertest1',
        password: 'noPass',
      };
      const response = await request(app).post('/users/login').send(loginMock);

      expect(response.status).toBe(401);
    });
  });

  describe('When the Patch method to users/add/cart/:idGuitar path is performed', () => {
    test('Then if the information is OK, the status code should be 202', async () => {
      const loginAdminMock = {
        username: 'supertest1',
        password: '12345',
      };

      const urlTest = `/users/add/cart/${guitarTestId1}`;

      await request(app).post('/users/login').send(loginAdminMock);

      const response = await request(app)
        .patch(urlTest)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(202);
    });

    test('Then if the information is NOK (no tokenInfo), the status code should be 498', async () => {
      const loginUserMock = {
        username: 'supertest2',
        password: '12345',
      };

      const urlTest = `/users/add/cart/${guitarTestId1}`;

      await request(app).post('/users/login').send(loginUserMock);

      const response = await request(app).patch(urlTest);

      expect(response.status).toBe(498);
    });

    test('Then if the information is NOK (no idGuitar in params), the status code should be 404', async () => {
      const loginUserMock = {
        username: 'supertest2',
        password: '12345',
      };

      const urlTest = `/users/add/cart/`;

      await request(app).post('/users/login').send(loginUserMock);

      const response = await request(app)
        .patch(urlTest)
        .set('Authorization', `Bearer ${tokenUserTest}`);

      expect(response.status).toBe(404);
    });

    test('Then if the information is NOK (the idGuitar is wrong), the status code should be 400', async () => {
      const loginAdminMock = {
        username: 'supertest1',
        password: '12345',
      };

      const urlTest = `/users/add/cart/111111`;

      await request(app).post('/users/login').send(loginAdminMock);

      const response = await request(app)
        .patch(urlTest)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(400);
    });

    test('Then if the information is NOK (guitar is already added), the status code should be 405', async () => {
      const loginAdminMock = {
        username: 'supertest1',
        password: '12345',
      };

      const urlTest = `/users/add/cart/${guitarTestId1}`;

      await request(app).post('/users/login').send(loginAdminMock);

      const response = await request(app)
        .patch(urlTest)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(405);
    });
  });
});
