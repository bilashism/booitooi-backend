import { Schema, model } from 'mongoose';
import { bookGenres, bookLabel } from './book.constant';
import { BookModel, IBook, IBookReview } from './book.interface';

const bookReviewSchema = new Schema<IBookReview>({
  reviewer: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
});
// Book Schema
const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, enum: bookGenres, required: true },
    publicationDate: { type: String, required: true },
    label: { type: String, enum: bookLabel },
    reviews: [bookReviewSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
export const Book = model<IBook, BookModel>('Book', bookSchema);
