import passport from "passport";

/**
 * @param {import('express').Router} router 
 */
export function loginRouter(router) {
    router.post('/', passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true
    }));

    router.get('/logout', (req, res, next) => {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    });
}