import { render } from "./../../../infra/utils/render";

/**
 * @param {import('express').Router} router 
 */
export function resetPassword(router) {
    router.get('/password', render('password-reset'));
    router.post('/password', (req, res) => {
        
    });
}