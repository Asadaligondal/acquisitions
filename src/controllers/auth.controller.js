import logger from '../config/logger.js';
import { authenticateUser } from '../services/auth.service.js';
import { createUser } from '../services/auth.service.js';
import { formatValidationErrors } from '../utils/format.js';
import { signInSchema } from '../validations/auth.validation.js';
import { signupSchema } from '../validations/auth.validation.js';
import {cookies} from '../utils/cookies.js';
import jwt from 'jsonwebtoken';
export const signup = async(req, res, next) => {
    try {
        // DEBUG: Check JWT_SECRET at runtime
        console.log('=== JWT SECRET DEBUG ===');
        console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
        console.log('JWT_SECRET value:', process.env.JWT_SECRET);
        console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);
        console.log('========================');

        const validationResult = signupSchema.safeParse(req.body);
        if(!validationResult.success){
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationErrors(validationResult.error)
            });
        }

        const {name, email, password, role} = validationResult.data;

        // Auth Service
        const user = await createUser({name, email, password, role});
        
        // Check JWT_SECRET before using
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is undefined at runtime!');
            throw new Error('JWT_SECRET environment variable is not available');
        }
        
        console.log('About to sign JWT with secret length:', process.env.JWT_SECRET.length);
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        cookies.set(res, 'token', token);
        
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.role
            }
        });
        
    } catch(e) {
        logger.error('Error during signup validation', e);
        res.status(500).json({
            error: 'Internal server error',
            message: e.message
        });
    }
};

export const signIn = async (req, res, next) => {
    try {
        const validationResult = signInSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationErrors(validationResult.error),
            });
        }

        const { email, password } = validationResult.data;
        const user = await authenticateUser(email, password);

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        cookies.set(res, 'token', token);

        logger.info('User logged in successfully', { email });
        res.status(200).json({
            message: 'User logged in successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (e) {
        logger.error('Error during sign-in', e);
        if (e.message === 'User not found' || e.message === 'Invalid password') {
            return res.status(401).json({ error: e.message });
        }
        next(e);
    }
};

export const signOut = (req, res) => {
    try {
        cookies.clear(res, 'token');
        logger.info('User logged out successfully');
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (e) {
        logger.error('Error during sign-out', e);
        res.status(500).json({ error: 'Failed to log out' });
    }
};