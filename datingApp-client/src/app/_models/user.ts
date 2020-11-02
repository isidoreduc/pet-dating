import { IPhoto } from './photo';

export interface IUser {
  id: number;
  username: string;
  password: string;
  gender: string;
  age: number;
  knownAs: string;
  photoUrl: string;
  created: Date;
  lastActive: Date;
  introduction: string;
  city: string;
  country: string;
  lookinFor?: string;
  interests?: string;
  photos?: IPhoto[];
}
