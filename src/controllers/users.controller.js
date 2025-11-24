import logger from '../config/logger.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../services/users.services.js';
import { userIdSchema, updateUserSchema } from '../validations/users.validation.js';
import { formatValidationErrors } from '../utils/format.js';

export const fetchAllUsers = async (req, res) => {
    try {
        logger.info('Fetching all users from database');
        const allUsers = await getAllUsers();
        res.status(200).json({
            message: 'Users fetched successfully', 
            users: allUsers, 
            count: allUsers.length
        });
    } catch (e) {
        logger.error('Error fetching all users', e);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Could not fetch users'
        });
    }
};

export const fetchUserById = async (req, res) => {
    try {
        // Validate request parameters
        const validationResult = userIdSchema.safeParse(req.params);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationErrors(validationResult.error)
            });
        }

        const { id } = validationResult.data;
        logger.info('Fetching user by ID', { id });
        
        const user = await getUserById(parseInt(id));
        res.status(200).json({
            message: 'User fetched successfully',
            user
        });
    } catch (e) {
        logger.error('Error fetching user by ID', { id: req.params.id, error: e.message });
        
        if (e.message === 'User not found') {
            return res.status(404).json({
                error: 'User not found',
                message: 'The requested user does not exist'
            });
        }
        
        res.status(500).json({
            error: 'Internal server error',
            message: 'Could not fetch user'
        });
    }
};

export const updateUserById = async (req, res) => {
    try {
        // Validate request parameters
        const paramValidation = userIdSchema.safeParse(req.params);
        if (!paramValidation.success) {
            return res.status(400).json({
                error: 'Invalid user ID',
                details: formatValidationErrors(paramValidation.error)
            });
        }

        // Validate request body
        const bodyValidation = updateUserSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationErrors(bodyValidation.error)
            });
        }

        const { id } = paramValidation.data;
        const updates = bodyValidation.data;
        const userId = parseInt(id);
        
        // Authorization checks
        const currentUser = req.user; // Assuming user is attached to req by auth middleware
        
        // Users can only update their own information
        if (currentUser.id !== userId && currentUser.role !== 'admin') {
            logger.warn('Unauthorized user update attempt', { 
                currentUserId: currentUser.id, 
                targetUserId: userId 
            });
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only update your own profile'
            });
        }
        
        // Only admins can change user roles
        if (updates.role && currentUser.role !== 'admin') {
            logger.warn('Unauthorized role change attempt', { 
                currentUserId: currentUser.id, 
                currentUserRole: currentUser.role 
            });
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Only administrators can change user roles'
            });
        }

        logger.info('Updating user', { id: userId, updates, updatedBy: currentUser.id });
        
        const updatedUser = await updateUser(userId, updates);
        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (e) {
        logger.error('Error updating user', { id: req.params.id, error: e.message });
        
        if (e.message === 'User not found') {
            return res.status(404).json({
                error: 'User not found',
                message: 'The requested user does not exist'
            });
        }
        
        res.status(500).json({
            error: 'Internal server error',
            message: 'Could not update user'
        });
    }
};

export const deleteUserById = async (req, res) => {
    try {
        // Validate request parameters
        const validationResult = userIdSchema.safeParse(req.params);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Invalid user ID',
                details: formatValidationErrors(validationResult.error)
            });
        }

        const { id } = validationResult.data;
        const userId = parseInt(id);
        const currentUser = req.user; // Assuming user is attached to req by auth middleware
        
        // Authorization checks
        // Users can delete their own account, admins can delete any account
        if (currentUser.id !== userId && currentUser.role !== 'admin') {
            logger.warn('Unauthorized user deletion attempt', { 
                currentUserId: currentUser.id, 
                targetUserId: userId 
            });
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only delete your own account or you must be an administrator'
            });
        }
        
        // Prevent admins from deleting themselves (optional business rule)
        if (currentUser.id === userId && currentUser.role === 'admin') {
            logger.warn('Admin attempted to delete their own account', { 
                currentUserId: currentUser.id 
            });
            return res.status(400).json({
                error: 'Bad request',
                message: 'Administrators cannot delete their own account'
            });
        }

        logger.info('Deleting user', { id: userId, deletedBy: currentUser.id });
        
        const deletedUser = await deleteUser(userId);
        res.status(200).json({
            message: 'User deleted successfully',
            user: deletedUser
        });
    } catch (e) {
        logger.error('Error deleting user', { id: req.params.id, error: e.message });
        
        if (e.message === 'User not found') {
            return res.status(404).json({
                error: 'User not found',
                message: 'The requested user does not exist'
            });
        }
        
        res.status(500).json({
            error: 'Internal server error',
            message: 'Could not delete user'
        });
    }
};