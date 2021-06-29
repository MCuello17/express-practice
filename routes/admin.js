const express = require('express');
const { check } = require('express-validator/check');

const productsController = require('../controllers/products');

const router = express.Router();

// (GET)/admin/new-product => New product form
router.get('/new-product', productsController.getAddProduct);

// (POST)/admin/new-product => Creation of new product and redirect to /
router.post('/new-product', [
    check('title', "The product title must be at least 5 characters long")
        .isLength({ min: 5 }),
    check('imageUrl', "The product image must be a valid URL")
        .isURL({ protocols: ['https'], require_protocol: true, }),
    check('currency', "The product currency must be a valid currency")
        .isLength({ min: 1 }),
    check('price')
        .isLength({ min: 1 })
        .withMessage("The product price cannot be empty")
        .isNumeric()
        .withMessage("Invalid product price"),
    check('description', "The product title must be at least 10 characters long")
        .isLength({ min: 10 }),
    check('stock')
        .isLength({ min: 1 })
        .withMessage("You must specify a product stock")
        .isNumeric()
        .withMessage("Invalid product stock"),
], productsController.postAddProduct);

// (GET)/admin/edit-product/:productId => Edit product form
router.get('/edit-product/:productId', productsController.getEditProduct);

// (POST)/admin/edit-product => Edit the product and redirect to /products/:productId
router.post('/edit-product', [
    check('title', "The product title must be at least 5 characters long")
        .isLength({ min: 5 }),
    check('imageUrl', "The product image must be a valid URL")
        .isURL({ protocols: ['https'], require_protocol: true, }),
    check('currency', "The product currency must be a valid currency")
        .isLength({ min: 1 }),
    check('price')
        .isLength({ min: 1 })
        .withMessage("The product price cannot be empty")
        .isNumeric()
        .withMessage("Invalid product price"),
    check('description', "The product title must be at least 10 characters long")
        .isLength({ min: 10 }),
    check('stock')
        .isLength({ min: 1 })
        .withMessage("You must specify a product stock")
        .isNumeric()
        .withMessage("Invalid product stock"),
], productsController.postEditProduct);

// (POST)/admin/delete-product => Deletes the product passed in the body and redirects to /products/:productId
router.post('/delete-product', productsController.postDeleteProduct);

module.exports = router;