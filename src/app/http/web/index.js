import { Router } from 'express';
import { render } from '../../../infra/utils/render.js';

const router = Router();

router.get('/', render('projects'));

export default router;
