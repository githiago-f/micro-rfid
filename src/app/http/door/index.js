import { Router } from 'express';
import { authorizeDoor } from './authorize-door.js';

const router = Router();

authorizeDoor(router);

export default router;
