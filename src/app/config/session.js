import passport from 'passport';
import expressSession from 'express-session';
import { randomUUID } from 'node:crypto';

export const sessionManager = expressSession({
    secret: process.env.SESSION_SECRET ?? randomUUID(),
    resave: false,
    saveUninitialized: false
});

export const session = passport.authenticate('session');
