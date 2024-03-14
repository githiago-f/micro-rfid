import passport from 'passport';
import session from 'express-session';
import { randomUUID } from 'node:crypto';

export const sessionManager = session({
    secret: process.env.SESSION_SECRET ?? randomUUID(),
    resave: false,
    saveUninitialized: false
});

export const session = passport.authenticate('session');
