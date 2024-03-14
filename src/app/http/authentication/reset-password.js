import { session } from "../../config/session.js";
import { render } from "./../../../infra/utils/render.js";

/**
 * @param {import('express').Router} router 
 */
export function resetPassword(router) {
    router.get('/password', session, render('password-reset'));
    router.post('/password', session, (req, res) => {
        
    });
}