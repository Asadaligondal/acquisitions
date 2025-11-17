import { ca, th } from 'zod/locales';
import logger from '../config/logger.js';
import bcrypt from 'bcrypt';
import {db} from '../config/database.js';
import {users} from '../models/user.model.js';
import {eq} from 'drizzle-orm';
export const hashpassword = async(password) => {
    try{    
        return await bcrypt.hash(password, 10);

    } catch(e){
        logger.error('Error hashing password', e);
        throw new Error('Password hashing failed');
    }
}

export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (e) {
        logger.error('Error comparing passwords', e);
        throw new Error('Password comparison failed');
    }
};

export const authenticateUser = async (email, password) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        return user;
    } catch (e) {
        logger.error('Error authenticating user', e);
        throw e;
    }
};

export const createUser = async({name, email, password, role = 'user'}) => {
    try{
        // Simulate user creation and return user object
        const existingUser = await db.select().from(users).where(eq(usersSync.email,email)).limit(1);
        if(existingUser.length > 0){ throw new Error('User with this email already exists'); }
        const hashedPassword = await hashpassword(password);
        const [user] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role
        }).returning({id:users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt});
        return user;

    }
    catch(e){
        logger.error('Error creating user', e);
        throw e;
    }}