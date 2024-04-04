import passport from 'passport';
import LocalStrategy from 'passport-local';
import { findUserByEmail, findUserById } from '../../domain/repositories/users.repository.js';
import { comp } from '../../infra/utils/encript.js';
import { Logger } from './logger.js';

const logger = Logger('auth');

passport.use('local', new LocalStrategy({ usernameField: 'email' }, function (email, password, next) {
    findUserByEmail(email)
        .then(async user => {
            logger.info('User found');
            if(!user.canAccessDashboard) {
                logger.error('Cannot use dashboard');
                throw new Error('User cannot use the dashboard, get in toutch with the system administrator');
            }
            const passwordMatch = await comp(password, user.password);
            if(!passwordMatch) next(null, false);
            logger.info('Password matched');
            return next(null, user);
        })
        .catch(e => {
            logger.error(e);
            next(e, false)
        });
}));

passport.serializeUser(function(user, done) {
    process.nextTick(() => done(null, user.id));
});

passport.deserializeUser(function(id, done) {
    findUserById(id)
        .then(user => done(null, user))
        .catch(err => done(err, false));
});
