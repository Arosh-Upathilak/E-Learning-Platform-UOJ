import express from 'express';
import {register, login, sendotp, verifyotp, forgotpassword, logout, dashboard} from '../controllers/userControllers.js';
import authenticateToken  from '../middelwares/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/sendotp', sendotp);
userRouter.post('/verifyotp', verifyotp);
userRouter.put('/forgotpassword', forgotpassword);
userRouter.post('/logout', logout);
userRouter.get('/dashboard', authenticateToken, dashboard);

export default userRouter;
