import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { userRole } from './user.constant';
import { IUser, IUserName, UserModel } from './user.interface';

// const userNameSchema = new Schema<IUserName>({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
// });

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
    // password: {
    //   type: String,
    //   select: 0,
    // },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.statics.isUserExist = async function (
  email: string
): Promise<Partial<IUser> | null> {
  return await User.findOne({ email }, { role: 1, email: 1, uid: 1 });
};

userSchema.statics.isPasswordMatched = async function (
  givenUid: string,
  savedUid: string
): Promise<boolean> {
  return await bcrypt.compare(givenUid, savedUid);
};

userSchema.pre('save', async function (next) {
  // hash password
  this.uid = await bcrypt.hash(this.uid, Number(config.BCRYPT_SALT_ROUNDS));
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);
