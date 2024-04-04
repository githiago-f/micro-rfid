import passport from "passport";
import { session } from "../../config/session.js";

/**
 * @param {import('express').Router} router 
 */
export function loginRouter(router) {
    router.post('/', passport.authenticate('local', {
        failureRedirect: '/',
        failureFlash: true
    }), (req, res, next) => {
        const { user, url } = req;
        if(user.isDefaultPassword) {
            if(/auth\/password/gi.test(url)) {
                return next();
            }
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