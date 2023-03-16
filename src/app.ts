import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { usersRouter } from './routers/users.router.js';
import createDebug from 'debug';
import { errorsMiddleware } from './middleware/errors.middleware.js';
import { guitarsRouter } from './routers/guitars.router.js';

const debug = createDebug('GW:app');

debug('app-initiated');

export const app = express();

const corsOptions = {
  origin: '*',
};

app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

app.use('/users', usersRouter);
app.use('/guitars', guitarsRouter);

app.use(errorsMiddleware);

app.get('*', (_req, resp) => {
  resp.send(
    `
    <h1>Welcome to the Guitar World server</h1>
    <h2>Endpoints:</h2>
    <br>
    <h3> /users </h3>
    <ul>
      <li> POST /users/register </li>
      <li> POST /users/login </li>
      <li> GET (logged) /users/:idUser </li>
      <li> PATCH (logged) /users/add/cart/:idGuitar </li>
      <li> PATCH (logged) /users/remove/cart/:idGuitar </li>
    </ul>
      <br>
    <h3> /guitars </h3>
    <ul>
      <li> GET (logged) guitars/products?style=&page= </li>
      <li> GET (logged) guitars/details/:idGuitar </li>
      <li> POST (logged and Admin) /guitars/create </li>
      <li> PATCH (logged and Admin) /guitars/edit/:idGuitar </li>
      <li> DELETE (logged and Admin) /guitars/delete/:idGuitar </li>
    </ul>
  `
  );
});
