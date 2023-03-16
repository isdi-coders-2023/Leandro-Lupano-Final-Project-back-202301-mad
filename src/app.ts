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
    <p>Endpoints:</p>
    <br>
    <p> /users </p>
    <ul>
      <li> POST /users/register" </li>
      <li> POST /users/login" </li>
      <li> GET (logged) /users/:userId" </li>
      <li> PATCH (logged) /users/add/cart/:guitarId" </li>
      <li> PATCH (logged) /users/remove/cart/:guitarId" </li>
    </ul>
      <br>
    <p> /guitars </p>
    <ul>
      <li> GET (logged) guitars/style/:guitarStyle </li>
      <li> GET (logged) guitars/details/:guitarId </li>
      <li> GET (logged) /guitars/:page" </li>
      <li> POST (logged and Admin) /guitars/create </li>
      <li> PATCH (logged and Admin) /guitars/edit/:guitarId </li>
      <li> DELETE (logged and Admin) /guitars/delete/:guitarId </li>
    </ul>
  `
  );
});
