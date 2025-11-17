import logger from '../config/logger.js';
import { authenticateUser } from '../services/auth.service.js';
import { formatValidationErrors } from '../utils/format.js';
import { signInSchema } from '../validations/auth.validation.js';
import {cookies} from '../utils/cookies.js';
import jwt from 'jsonwebtoken';

export const signup = async(req, res, next) => {

 try{
    const validationResult = signupSchema.safeParse(req.body);
    if(!validationResult.success){
        return res.status(400).json({error: 'validation failed', details: formatValidationErrors(validationResult.error)});
    }
 
 
const {name, email, password, role} = validationResult.data;

//Auth Service
const user = await createUser({name, email, password, role});
const token = jwttoken.sign({id: user.id, email: user.email, role: user.role});
cookies.set(res, 'token', token)

logger.info("User Registered successfully", {email, role});
res.status(201).json({message: 'User registered successfully',
    user: {
        id: user.id, name: user.name, email: user.email, role: user.role
    }
});
 }
 catch(e){
    logger.error('Error during signup validation', e);
    if(e.message === 'User witgh this email already exists'){
        return res.status(409).json({error: e.message});
    }
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