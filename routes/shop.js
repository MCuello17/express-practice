const express = require('express');
const path = require('path');

const productsController = require('../controllers/products');
const shopController = require('../controllers/shop');

const router = express.Router();

// (GET)/ => product list
router.get('/', productsController.getProducts);

// (GET)/products/:productId => product details
router.get('/products/:productId', productsController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

module.exports = router;