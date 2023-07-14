import httpStatus from 'http-status';
import { Schema, model } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import {
  academicSemesterCodes,
  academicSemesterMonths,
  academicSemesterTitles,
} from './academicSemester.constant';
import {
  AcademicSemesterModel,
  IAcademicSemester,
} from './academicSemester.interface';

//
const academicSemesterSchema = new Schema<IAcademicSemester>(
  {
    title: {
      type: String,
      required: true,
      enum: academicSemesterTitles,
    },
    code: {
      type: String,
      required: true,
      enum: academicSemesterCodes,
    },
    year: {
      type: String,
      required: true,
    },
    endMonth: {
      type: String,
      required: true,
      enum: academicSemesterMonths,
    },
    startMonth: {
      type: String,
      required: true,
      enum: academicSemesterMonths,
    },
  },
  {
    timestamps: true,
  }
);

// pre hook must be called before creating the model
academicSemesterSchema.pre('save', async function (next) {
  const isExisting = await AcademicSemester.findOne({
    title: this.title,
    year: this.year,
  });
  if (isExisting) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'This Academic Semester already exists!'
    );
  }
  next();
});

export const AcademicSemester = model<IAcademicSemester, AcademicSemesterModel>(
  'AcademicSemester',
  academicSemesterSchema
);
