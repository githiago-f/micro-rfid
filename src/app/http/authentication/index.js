import { Router } from 'express';
import { resetPassword } from './reset-password.js';
import { loginRouter } from './login.js';

const router = Router();

resetPassword(router);
loginRouter(router);

export default router;
