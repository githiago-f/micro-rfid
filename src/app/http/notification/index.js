import { Router } from 'express';
import { findLastDenied, markAsViewed } from '../../../domain/repositories/requests.repository.js';
import { render } from '../../../infra/utils/render.js';

const router = Router();

router.get('/:id/view', async (req, res) => {
    const id = req.params.id;
    await markAsViewed(id, true);
    return res.redirect("/dashboard");
});

router.get('/', async (req, res) => {
    const notifications = await findLastDenied();
    const options = { title: 'notifications', notifications };
    return render('notifications', options)(req, res);
});

export default router;
