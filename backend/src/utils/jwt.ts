import jwt from 'jsonwebtoken';
import config from '../config/config';
import { JwtPayload } from '../types';

/**
 * Generate JWT token for authenticated user
 */
export const generateToken = (userId: string, email: string): string => {
  const payload: JwtPayload = {
    userId,
    email,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '30d', // 30 days
  });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
};
