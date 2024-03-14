import { Router } from 'express';
import { resetPassword } from './reset-password';

const router = Router();

resetPassword(router);

export default router;
