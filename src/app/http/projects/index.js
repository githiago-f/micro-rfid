import { Router } from 'express';
import { render } from '../../../infra/utils/render.js';

const router = Router();

router.get('/', render('create-project', { title: 'Novo projeto'}));

export default router;
