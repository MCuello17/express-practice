const express = require('express');
const path = require('path');

const rootDir = require('../utils/path');
const { products } = require('./admin.js');

const router = express.Router();

// (GET)/ => product list
router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // Can also be used as:
    // res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
    console.log(products);
});

module.exports = router;