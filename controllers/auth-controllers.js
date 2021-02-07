const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const { hash, compare } = require('bcryptjs');

function signUpPageGet(req, res) {
    res.render('sign-up');
};

// Create a new user. Handles the POST request for the /sign-up route.
const signUpPagePost = [
    check('email', 'You must provide an email').exists().isEmail().escape().normalizeEmail(), // Check for valid email.
    check('password', 'You must provide a password').exists().escape(), // Check if password was provided.
    check('confirmPassword', 'Passwords must match') // Check if passwords match.
        .exists()
        .custom((confirmPassword, { req }) => confirmPassword === req.body.password)
        .escape(),

    (req, res, next) => {
        const errors = validationResult(req); // Validate the request object.
        if (!errors.isEmpty()) {
            res.render('sign-up');
            return;
        }
        User.findOne({ email: req.body.email }, function(err, user) {
            if (err) { return next(err); }
            if (user) {
                res.render('sign-up');
                return;
            }
            hash(req.body.password, 10, function(err, encryptedPassword) {
                if (err) {
                    return next(err);
                }

                const newUser = new User({
                    firstName: 'John',
                    lastName: 'Smith',
                    email: req.body.email,
                    password: encryptedPassword,
                    membershipStatus: req.body.isAdmin ? 'admin' : 'standard'
                });

                newUser.save(function(err) {
                    if (err) { return next(err); }
                    res.redirect('/sign-in');
                });
            });
        });
    }
];

function signInPageGet(req, res) {
    res.render('sign-in');
};

function becomeMemberPageGet(req, res, next) {
    if (req.user) {
        res.render('become-member');
    }
    res.render('sign-in');
};

function becomeMemberPagePost(req, res, next) {
    if (req.body.password === process.env.BECOME_MEMBER_PASSWORD) {
        User.findById(req.user.id, function(err, user) {
        if (err) { return next(err); }
        user.membershipStatus = 'member';
        user.save();
        res.redirect('/');
        });
    };
}

function signOutGet(req, res) {
    req.logout();
    res.redirect('/');
};

module.exports = { signUpPageGet, signUpPagePost, signInPageGet, becomeMemberPageGet, becomeMemberPagePost, signOutGet };