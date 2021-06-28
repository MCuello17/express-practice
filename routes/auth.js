const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

// (GET)/login => User login page
router.get('/login', authController.getLogin);

// (POST)/login => Login the user
router.post('/login', authController.postLogin);

module.exports = router;