const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/new-product', {
        pageTitle: 'Create a new product - My Shop!',
    });
}

exports.postAddProduct = (req, res, next) => {
    const {title, imageUrl, description, currency, price, stock} = req.body;
    console.log(title, imageUrl, description, currency, price, stock);
    const product = new Product(title, imageUrl, description, currency, price, stock);
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

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId, product => {
        if (!product) {
            res.status(404).render('error/404', {
                pageTitle: '404 - My Shop!',
            });
        }
        res.render('shop/product-details', {
            pageTitle: product.title,
            product: product,
        });
    });
};