const express = require('express');
const path = require('path');

const productsController = require('../controllers/products');
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// (GET)/ => product list
router.get('/', productsController.getProducts);

// (GET)/products/:productId => product details
router.get('/products/:productId', productsController.getProduct);

// (GET)/cart => Cart items list
router.get('/cart', isAuth, shopController.getCart);

// (POST)/cart => Add item to cart
router.post('/cart', isAuth, shopController.postCart);

// (POST)/cart/delete => Delete item from cart
router.post('/cart/delete', isAuth, shopController.postCartDelete);

// (GET)/cart => Orders list
router.get('/orders', isAuth, shopController.getOrders);

// (POST)/checkout => Creates an order with items from cart
router.post('/checkout', isAuth, shopController.postCheckout);

module.exports = router;