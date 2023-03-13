import http from 'http';
import { app } from './app.js';
import { dbConnect } from './db/db.connect.js';
import { config } from './config.js';
const { port } = config;
import createDebug from 'debug';

const debug = createDebug('GW');
const PORT = port || 6000;
const server = http.createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('DB: ', mongoose.connection.db.databaseName);
  })
  .catch((error) => server.emit('error', error));

server.on('error', (error) => {
  debug('Server error', error.message);
});

server.on('listening', () => {
  debug('Listening http://localhost:' + PORT);
});
