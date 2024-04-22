import { Router } from 'express';
import { markAsViewed } from '../../../domain/repositories/requests.repository.js';

const router = Router();

router.get('/:id/view', async (req, res) => {
    const id = req.params.id;
    await markAsViewed(id, true);
    return res.redirect("/dashboard");
});

export default router;
