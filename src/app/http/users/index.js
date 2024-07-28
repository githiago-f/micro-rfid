import { Router } from 'express';
import { User } from '../../../domain/user.js';
import { create, findById, updateById } from '../../../domain/repositories/users.repository.js';
import { Card } from '../../../domain/card.js';
import { allowUserByProject, findAll } from '../../../domain/repositories/projects.repository.js';
import { Logger } from '../../config/logger.js';
import { render } from '../../../infra/utils/render.js';

const logger = Logger('users-controller');

const router = Router();

router.get('/', async (req, res) => {
    const projects = await findAll();
    return render('create-user', { title: 'Novo usuário', projects })(req, res);
});

router.post('/', async (req, res) => {
    const { card_rfid, name, email, permissions, notification_id } = req.body;
    logger.info(`Creating user ${email} with rfid ${card_rfid}`);
    const permissionsList = permissions?.length > 0 ? permissions : 'common-door'
    const user = new User({
        name, 
        email, 
        permissions: permissionsList
    });
    user.setCard(new Card({ card_id: undefined, card_rfid }));
    user.id = await create(user, Number(notification_id));
    res.redirect(`/users/${user.id}/projects`);
});

router.get('/:id', async (req, res) =>{
    const projects = await findAll();
    const user = await findById(req.params.id);
    if(!user) {
        return res.status(404).json({ message: 'No user found' });
    }
    logger.info(JSON.stringify(user));
    return render('view-user', { title: user.email, projects, user })(req, res);
});

router.get('/:id/projects', async (req, res) => {
    const projects = await findAll();
    return render('project-select', { 
        projects, 
        title: 'Selecionar projeto',
        callback: `/users/${req.params.id}/projects`
    })(req, res);
});

router.post('/:id/projects', async (req, res) => {
    const userId = req.params.id;
    const { project_due_date, project_id } = req.body;
    await allowUserByProject(userId, project_id, project_due_date);
    res.redirect('/dashboard');
});

router.post('/:id', async (req, res) => {
    const id = req.params.id;
    const { name, card_rfid, email } = req.body;
    const cardId = card_rfid.trim() === '' ? undefined : card_rfid.trim();
    await updateById(id, { name, email, card: { rfid: cardId }});
    res.redirect('/users/' + id);
});

export default router;
