const express = require('express');
const path = require('path');

const productsController = require('../controllers/products');

const router = express.Router();

// (GET)/admin/new-product => New product form
router.get('/new-product', productsController.getAddProduct);

// (POST)/admin/new-product => Creation of new product and redirect to /
router.post('/new-product', productsController.postAddProduct);

module.exports = router;