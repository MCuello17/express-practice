const express = require('express');
const path = require('path');

const rootDir = require('../utils/path');

const router = express.Router();

const products = [];

// (GET)/admin/new-product => New product form
router.get('/new-product', (req, res, next) => {
    res.render('new-product', {
        pageTitle: 'Create a new product - My Shop!',
    });
});

// (POST)/admin/new-product => Creation of new product and redirect to /
router.post('/new-product', (req, res, next) => {
    products.push({title: req.body.title});
    res.redirect('/');
});

exports.router = router;
exports.products = products;