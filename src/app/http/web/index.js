import { Router } from 'express';
import { findAllPaged as findProjects } from '../../../domain/repositories/projects.repository.js';
import { findAllPaged as findUsers } from '../../../domain/repositories/users.repository.js';
import { render } from '../../../infra/utils/render.js';

const router = Router();

router.get('/', async (req, res) => {
    const { ppage, porder, psortBy, upage, uorder, usortBy } = req.query;

    const projects = await findProjects(Number(ppage), psortBy, porder);
    const users = await findUsers(Number(upage), usortBy, uorder);

    return render('dashboard', {
        title: 'Dashboard',
        projects,
        users
    })(req, res);
});



export default router;
