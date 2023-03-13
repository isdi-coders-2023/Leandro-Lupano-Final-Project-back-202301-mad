/* eslint-disable no-negated-condition */
import mongoose from 'mongoose';
import { config } from '../config.js';

const { user, password, cluster } = config;

export const dbConnect = () => {
  const dbName =
    process.env.NODE_ENV !== 'test' ? 'GuitarWorld' : 'TestingGuitarWorld';

  const uri = `mongodb+srv://${user}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;

  return mongoose.connect(uri);
};
