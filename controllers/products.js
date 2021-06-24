const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/new-product', {
        pageTitle: 'Create a new product - My Shop!',
    });
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll(products => {
        res.render('shop/product-list', {
            products: products,
            pageID: 'shop',
        });
    });
}