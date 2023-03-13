import { UserStructure } from '../entities/user.model';
import { HTTPError } from '../errors/errors.js';
import { Repo } from './repo.interface';
import { UserModel } from './users.mongo.model.js';
import createDebug from 'debug';

const debug = createDebug('GW:users-repo');

export class UsersMongoRepo implements Repo<UserStructure> {
  constructor() {
    debug('Users-Repo instanced');
  }

  async read(): Promise<UserStructure[]> {
    debug('read method');

    const data = await UserModel.find().populate('guitars');

    return data;
  }

  async readId(id: string): Promise<UserStructure> {
    debug('readID method');

    const data = await UserModel.findById(id).populate('guitars');

    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in readID');

    return data;
  }

  async create(info: Partial<UserStructure>): Promise<UserStructure> {
    debug('create method');

    const data = await UserModel.create(info);

    return data;
  }

  async update(info: Partial<UserStructure>): Promise<UserStructure> {
    debug('update method');

    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    }).populate('guitars');

    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in update');

    return data;
  }

  async erase(id: string): Promise<void> {
    debug('destroy method');

    const data = await UserModel.findByIdAndDelete(id);

    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: ID not found'
      );
  }

  async search(query: { key: string; value: unknown }) {
    debug('search method');

    const data = await UserModel.find({ [query.key]: query.value }).populate(
      'guitars'
    );

    return data;
  }
}
