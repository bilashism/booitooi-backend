import { Model } from 'mongoose';
export type IAcademicFacultyFilters = {
  searchTerm?: string;
};
export type IAcademicFaculty = {
  title: string;
};

export type AcademicFacultyModel = Model<IAcademicFaculty>;
