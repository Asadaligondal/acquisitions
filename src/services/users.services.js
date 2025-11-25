import logger from '../config/logger.js';
import { db } from '../config/database.js';
import { users } from '../models/user.model.js';
import { eq } from 'drizzle-orm';

export const getAllUsers = async () => {
  try {
    logger.info('Fetching all users from database');
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);
    return allUsers;
  } catch (e) {
    logger.error('Error fetching all users', e);
    throw new Error('Could not fetch users');
  }
};

export const getUserById = async id => {
  try {
    logger.info('Fetching user by ID', { id });
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (e) {
    logger.error('Error fetching user by ID', { id, error: e.message });
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  try {
    logger.info('Updating user', { id, updates });

    // Check if user exists

    // Update user with timestamp
    const updatedUserData = {
      ...updates,
      updatedAt: new Date(),
    };

    const [updatedUser] = await db
      .update(users)
      .set(updatedUserData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    logger.info('User updated successfully', { id });
    return updatedUser;
  } catch (e) {
    logger.error('Error updating user', { id, error: e.message });
    throw e;
  }
};

export const deleteUser = async id => {
  try {
    logger.info('Deleting user', { id });

    // Check if user exists

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    logger.info('User deleted successfully', { id });
    return deletedUser;
  } catch (e) {
    logger.error('Error deleting user', { id, error: e.message });
    throw e;
  }
};
