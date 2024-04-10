import { session } from "../../config/session.js";
import { render } from "./../../../infra/utils/render.js";
import { comp } from '../../../infra/utils/encript.js';
import { updateById } from '../../../domain/repositories/users.repository.js';
import { Logger } from "../../config/logger.js";

const logger = Logger('reset-password');

/**
 * @param {import('express').Router} router 
 */
export function resetPassword(router) {
    router.get('/password', session, render('password-reset'));

    router.post('/password', session, async (req, res) => {
        const user = req.user;
        const { newPassword, oldPassword } = req.body;

        const passwordMatch = await comp(oldPassword, user.password);
        if(!passwordMatch) return res.status(422).json({ message: 'Wrong password' });
        const newUser = await updateById(user.id, { ...user, password: newPassword });
        
        logger.info('User generated: ' + JSON.stringify(newUser));

        res.status(200).redirect('/dashboard');
    });
}