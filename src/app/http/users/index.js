import { Router } from 'express';
import { User } from '../../../domain/user.js';
import { create } from '../../../domain/repositories/users.repository.js';
import { Card } from '../../../domain/card.js';
import { findAll } from '../../../domain/repositories/projects.repository.js';

const router = Router();

router.get('/', (req, res) => {
    const projects = findAll();
    res.render('create-user', { title: 'Novo usuário', projects, ...req.query });
});

router.post('/', async (req, res) => {
    const { card_rfid, name, email, permissions, notification_id } = req.body;
    const permissionsList = permissions?.length > 0 ? permissions : 'common-door'
    const user = new User({
        name, 
        email, 
        permissions: permissionsList
    });
    user.setCard(new Card({ id: undefined, rfid: card_rfid }));
    user.id = await create(user, Number(notification_id));
    res.redirect('/users/projects?user_id=' + user.id);
});

export default router;
