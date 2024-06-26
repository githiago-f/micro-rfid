import passport from 'passport';
import expressSession from 'express-session';
import { randomUUID } from 'node:crypto';

export const sessionManager = expressSession({
    secret: (process.env.SESSION_SECRET?.trim() === '') ? 
        randomUUID() : 
        process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
});

/**
 * @type {import('express').RequestHandler}
 */
export const session = passport.authenticate('session');
