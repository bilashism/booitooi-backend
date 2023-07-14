import { Schema, model } from 'mongoose';
import { cowBreeds, cowCategory, cowLabel, cowLocations } from './cow.constant';
import { CowModel, ICow } from './cow.interface';

// Cow Schema
const cowSchema = new Schema<ICow>(
  {
    price: { type: Number, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    name: { type: String, required: true },
    location: { type: String, enum: cowLocations, required: true },
    breed: { type: String, enum: cowBreeds, required: true },
    label: { type: String, enum: cowLabel, default: 'for sale' },
    category: { type: String, enum: cowCategory, required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming the User model has been defined
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
export const Cow = model<ICow, CowModel>('Cow', cowSchema);
