const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        const totalPrice = cart.totalPrice || 0;
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id)
                if (cart.products.find(prod => prod.id === product.id)) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                pageTitle: 'Cart - My Shop!',
                pageId: 'cart',
                products: cartProducts,
                price: totalPrice,
            });
        });
    })
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        if (!product) res.redirect('/');
        Cart.addProduct(productId, product.price);
    });
    res.redirect('/cart');
};

exports.postCartDelete = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.deleteProduct(productId, produc.price);
        res.redirect('/cart');
    });
}