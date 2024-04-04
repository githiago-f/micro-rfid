import { session } from "../../config/session.js";
import { render } from "./../../../infra/utils/render.js";
import { comp } from '../../../infra/utils/encript.js';
import { save } from '../../../domain/repositories/users.repository.js';

/**
 * @param {import('express').Router} router 
 */
export function resetPassword(router) {
    router.get('/password', session, render('password-reset'));

    router.patch('/password', session, async (req, res) => {
        const user = req.user;
        const { newPassword, oldPassword } = req.body;

        const passwordMatch = await comp(oldPassword, user.password);
        if(!passwordMatch) return res.status(422).body({ message: 'Wrong password' });
        const newUser = await save(user.id, { ...user, password: newPassword });
        res.status(200).body(newUser);
    });
}