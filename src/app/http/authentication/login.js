import passport from "passport";
import { session } from "../../config/session.js";

/**
 * @param {import('express').Router} router 
 */
export function loginRouter(router) {
    router.post('/', passport.authenticate('local', {
        failureRedirect: '/',
        failureFlash: true
    }), (req, res) => {
        const { user } = req;
        if(user.isDefaultPassword) {
            return res.redirect('/auth/password');
        }
        return res.redirect('/dashboard');
    });

    router.get('/logout', session, (req, res, next) => {
        req.logOut(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    });
}