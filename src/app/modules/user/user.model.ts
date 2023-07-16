import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { userRole } from './user.constant';
import { IUser, IUserName, UserModel } from './user.interface';

const userNameSchema = new Schema<IUserName>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

// User Schema
const userSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      required: true,
      enum: userRole.filter(role => role !== 'admin'),
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      required: true,
    },
    displayName: {
      type: String,
    },
    uid: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      select: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.statics.isUserExist = async function (
  phoneNumber: string
): Promise<Partial<IUser> | null> {
  return await User.findOne(
    { phoneNumber },
    { password: 1, role: 1, phoneNumber: 1 }
  );
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre('save', async function (next) {
  // hash password
  this.password = await bcrypt.hash(
    this.password,
    Number(config.BCRYPT_SALT_ROUNDS)
  );
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);
