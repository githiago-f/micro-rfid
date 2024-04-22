import { Router } from 'express';
import { findLastDenied } from '../../../domain/repositories/requests.repository.js';

const router = Router();

router.get('/', async (req, res) => {
    const notifications = await findLastDenied();

    res.render('dashboard', {
        title: 'Dashboard',
        projects: [],
        users: [],
        notifications
    });
});



export default router;
