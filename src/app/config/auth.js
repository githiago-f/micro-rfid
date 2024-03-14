import passport from 'passport';
import LocalStrategy from 'passport-local'

passport.use('local', new LocalStrategy({}, function (email, password, next) {

}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    // TODO find user
    done(null, null);
});
