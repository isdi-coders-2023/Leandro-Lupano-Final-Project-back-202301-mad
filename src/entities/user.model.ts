import { GuitarStructure } from './guitar.model';

export type UserStructure = {
  id: string;
  userName: string;
  email: string;
  password: string;
  role: string;
  myGuitars: GuitarStructure[];
};
