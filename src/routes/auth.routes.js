import express from 'express';
const router = express.Router();
import { signup } from '../controllers/auth.controller.js';

router.post('/sign-up', signup);
router.post('/sign-in', (req, res) => {
    res.send('POST api/auth/sign-in response')});
router.post('/sign-out', (req, res) => {
    res.send('POST api/auth/sign-out response')});
export default router;
