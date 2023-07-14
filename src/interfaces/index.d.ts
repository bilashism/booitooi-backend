import { IVerifiedUserToken } from '../helpers/jwtHelper';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      user: IVerifiedUserToken;
    }
  }
}
