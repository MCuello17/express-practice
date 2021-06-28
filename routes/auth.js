const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

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
router.post('/signup', authController.postSignup);

// (POST)/logout => Logout the user
router.post('/logout', authController.postLogout);

// (POST)/reset-password => User password reset request page
router.post('/reset-password', authController.postResetPassword);

// (POST)/new-password => User password reset page
router.post('/new-password', authController.postNewPassword);

module.exports = router;