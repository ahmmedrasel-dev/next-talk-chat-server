export interface IUser {
  _id?: string;
  full_name: string;
  email?: string;
  phone: string;
  password: string;
  contacts?: Array<string>; // or Array<IUser> if populated
}
