import express from 'express';
import { fetchAllUsers, fetchUserById, updateUserById, deleteUserById } from '../controllers/users.controller.js';
// import { authMiddleware } from '../middleware/auth.middleware.js'; // Uncomment when auth middleware is available

const router = express.Router();

// GET /api/users - Fetch all users
router.get('/', fetchAllUsers);

// GET /api/users/:id - Fetch user by ID
router.get('/:id', fetchUserById);

// PUT /api/users/:id - Update user by ID
// router.put('/:id', authMiddleware, updateUserById); // Enable when auth middleware is ready
router.put('/:id', updateUserById);

// DELETE /api/users/:id - Delete user by ID
// router.delete('/:id', authMiddleware, deleteUserById); // Enable when auth middleware is ready
router.delete('/:id', deleteUserById);

export default router;