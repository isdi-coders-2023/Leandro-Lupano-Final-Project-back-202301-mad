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

app.use('*', (_req, resp, next) => {
  resp.status(404).send(
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
    <title>Guitar World Server</title>
  </head>
  <body>
    <h1>Welcome to the Guitar World server</h1>
    <p>Endpoints:</p>
    <ul>
      <li>
        <a href="http://localhost:5000/users/register" style="cursor: pointer"
          >Register</a
        >
      </li>
      <li>
        <a href="http://localhost:5000/users/login" style="cursor: pointer"
          >Login</a
        >
      </li>
    </ul>
  </body>
</html>`
  );
  next();
});
