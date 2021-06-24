const express = require('express');
const path = require('path');

const productsController = require('../controllers/products');

const router = express.Router();

// (GET)/ => product list
router.get('/', productsController.getProducts);

module.exports = router;