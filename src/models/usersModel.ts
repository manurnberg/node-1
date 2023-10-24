import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../interfaces/usersInterface';

const userSchema = new Schema({
    _id: String,
    name: String,
    email: String,
    username: String,
    password: String,
    salt: String
  });

export default mongoose.model<User>('User', userSchema);