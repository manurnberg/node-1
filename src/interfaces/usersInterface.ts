export interface User extends Document {
    _id: string;
    name?: string;
    email?: string;
    username?: string;
    password?: string;
    salt?: string;
  }