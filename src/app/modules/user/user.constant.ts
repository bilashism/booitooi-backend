import { IUserRole } from './user.interface';
export const userSearchableFields = ['name', 'address'];
export const userFilterableFields = ['searchTerm', 'address'];

export const userRole: IUserRole[] = ['buyer', 'seller', 'admin'];
