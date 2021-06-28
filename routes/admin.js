const express = require('express');

const productsController = require('../controllers/products');

const router = express.Router();

router.use('/', (req, res, next) => {
    if (!req.session.isLoggedIn) return res.redirect('/');
    next();
});

// (GET)/admin/new-product => New product form
router.get('/new-product', productsController.getAddProduct);

// (POST)/admin/new-product => Creation of new product and redirect to /
router.post('/new-product', productsController.postAddProduct);

// (GET)/admin/edit-product/:productId => Edit product form
router.get('/edit-product/:productId', productsController.getEditProduct);

// (POST)/admin/edit-product => Edit the product and redirect to /products/:productId
router.post('/edit-product', productsController.postEditProduct);

// (POST)/admin/delete-product => Deletes the product passed in the body and redirects to /products/:productId
router.post('/delete-product', productsController.postDeleteProduct);

module.exports = router;