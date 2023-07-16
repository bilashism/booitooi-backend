import { Model, ObjectId } from 'mongoose';

export type IBookLabel = 'for sale' | 'sold out';

export type IBookGenre =
  | 'Fantasy'
  | 'Science Fiction'
  | 'Mystery'
  | 'Thriller'
  | 'Romance'
  | 'Young Adult'
  | 'Children'
  | 'Literary Fiction'
  | 'Historical'
  | 'Dystopian';

export type IBookFilters = {
  searchTerm?: string;
  maxPrice?: number;
  minPrice?: number;
};
export type IBookReview = {
  reviewer: string;
  rating: number;
  content: string;
};
export type IBook = {
  title: string;
  author: string;
  publicationDate: string;
  genre: IBookGenre;
  label?: IBookLabel;
  reviews?: IBookReview[];
};
export type BookModel = Model<IBook, Record<string, unknown>>;
