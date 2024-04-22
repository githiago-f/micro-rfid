import { Router } from 'express';
import { render } from '../../../infra/utils/render.js';

const router = Router();

router.get('/', render('create-user', { title: 'Novo usuário'}));

router.post('/', (req, res) => {
    // TODO create user
    res.json({});
});

export default router;
