import jwt, { SignOptions } from 'jsonwebtoken';
import mongoose from 'mongoose';

export const generateToken = (id: mongoose.Types.ObjectId): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  });
};
