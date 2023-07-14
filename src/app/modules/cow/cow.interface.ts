import { Model, ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';

export type ICowCategory = 'Dairy' | 'Beef' | 'Dual Purpose';
export type ICowLabel = 'for sale' | 'sold out';

export type ICowLocation =
  | 'Dhaka'
  | 'Chattogram'
  | 'Barishal'
  | 'Rajshahi'
  | 'Sylhet'
  | 'Comilla'
  | 'Rangpur'
  | 'Mymensingh';
export type ICowBreed =
  | 'Brahman'
  | 'Nellore'
  | 'Sahiwal'
  | 'Gir'
  | 'Indigenous'
  | 'Tharparkar'
  | 'Kankrej';

export type ICowFilters = {
  searchTerm?: string;
  maxPrice?: number;
  minPrice?: number;
};

export type ICow = {
  name: string;
  age: number;
  price: number;
  location: ICowLocation;
  breed: ICowBreed;
  weight: number;
  label: ICowLabel;
  category: ICowCategory;
  seller: ObjectId | IUser;
};
export type CowModel = Model<ICow, Record<string, unknown>>;
