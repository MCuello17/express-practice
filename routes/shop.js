const express = require('express');
const path = require('path');

const rootDir = require('../utils/path');
const { products } = require('./admin.js');

const router = express.Router();

// (GET)/ => product list
router.get('/', (req, res, next) => {
    res.render('shop', {
        products: products,
        pageID: 'shop',
    });
    // Can also be used as:
    // res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});

module.exports = router;