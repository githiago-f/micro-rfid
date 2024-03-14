import session from 'express-session';

export const sessionManager = session({
    secret: process.env.SESSION_SECRET ?? '',
    resave: false,
    saveUninitialized: false
});
