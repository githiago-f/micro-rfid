import { Router } from 'express';
import { findLastDenied } from '../../../domain/repositories/requests.repository.js';
import { findAllPaged as findProjects } from '../../../domain/repositories/projects.repository.js';
import { findAllPaged as findUsers } from '../../../domain/repositories/users.repository.js';

const router = Router();

router.get('/', async (req, res) => {
    const { ppage, porder, psortBy, upage, uorder, usortBy } = req.query;

    const notifications = await findLastDenied();
    const projects = await findProjects(Number(ppage), psortBy, porder);
    const users = await findUsers(Number(upage), usortBy, uorder);


    res.render('dashboard', {
        title: 'Dashboard',
        projects,
        users,
        notifications
    });
});



export default router;
