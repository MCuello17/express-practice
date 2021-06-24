const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Cart - My Shop!',
        pageId: 'cart'
    });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.addProduct(productId, product.price);
    });
    res.redirect('/cart');
};