import express from 'express';

import usersRouter from './profile/User.js';
import authRouter from './profile/auth.js';

//! create a router
const router = express.Router();

router.use('/users', usersRouter);
router.use('/auth', authRouter);

export default router;