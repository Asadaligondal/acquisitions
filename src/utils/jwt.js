import logger from '#config/logger.js';
import jwt, { verify } from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'change this for production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export const jwttoken = {
    sign: (payload) =>{
        try {
            return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        }catch (error) {
            logger.error('Error signing JWT token:', error);
            throw new Error('Error signing JWT token');
        }
    }
    verify: (token) => {
        try {
            return verify(token, JWT_SECRET);
        } catch (error) {
            logger.error('Error verifying JWT token:', error);
            throw new Error('Error verifying JWT token');
        }

}