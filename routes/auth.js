const express = require('express');
const { check, body } = require('express-validator/check')

const router = express.Router();

const authController = require('../controllers/auth');
const User = require('../models/user');

// (GET)/login => User login page
router.get('/login', authController.getLogin);

// (POST)/login => Login the user
router.post('/login', authController.postLogin);

// (GET)/signup => User signup page
router.get('/signup', authController.getSignup);

// (GET)/reset-password => User password reset request page
router.get('/reset-password', authController.getResetPassword);

// (GET)/reset-password => User password reset page
router.get('/reset-password/:token', authController.getNewPassword);

// (POST)/signup => signup the user
router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage("Please enter a valid email")
            // Custom validator setup:
            .custom((value, {req})  => {
                return User.findAll({where: {email: req.body.email}})
                    .then(([user]) => {
                        if (user) {
                            return Promise.reject("Email already exists");
                        }
                    });
            })
            // Sanitizers
            .normalizeEmail(),
        // Another way to validate and setup general errro messages:
        body('password', "Password must be at least 6 chatacters long")
            .isLength({ min: 6 }),
        body('confirmPassword')
            .custom((value, {req}) => {
                if (value !== req.body.password) throw new Error('Passwords must be identical');
                return true;
            })
    ],
    authController.postSignup
);

// (POST)/logout => Logout the user
router.post('/logout', authController.postLogout);

// (POST)/reset-password => User password reset request page
router.post('/reset-password', [
    check('email')
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),
], authController.postResetPassword);

// (POST)/new-password => User password reset page
router.post('/new-password', [
    check('password', "Password must be at least 6 chatacters long")
        .isLength({ min: 6 }),
    check('confirmPassword')
        .custom((value, {req}) => {
            if (value !== req.body.password) throw new Error('Passwords must be identical');
            return true;
        })
], authController.postNewPassword);

module.exports = router;