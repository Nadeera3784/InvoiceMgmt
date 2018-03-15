const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


/** Sign-up Strategy */

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, username, password, done) {
    req.checkBody('username', 'Invalid Username').notEmpty();
    req.checkBody('password', 'Invalid Password').notEmpty().isLength({min: 6});
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(error => {
            messages.push(error);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'username': username}, function(err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {message: 'User exists!'});
        }
        let newUser = new User();
        newUser.username = username;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));


/** Sign-in Strategy */

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, username, password, done) {
    req.checkBody('username', 'Username Required').notEmpty();
    req.checkBody('password', 'Password Required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(error => {
            messages.push(error);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'username': username}, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'User not found!'});
        }
        if (!user.validatePassword(password)) {
            return done(null, false, {message: 'Invalid password'})
        }
        return done(null, user);
    });
}));