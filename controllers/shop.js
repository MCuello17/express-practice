const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            res.render('shop/cart', {
                pageTitle: 'Cart - My Shop!',
                pageId: 'cart',
                products: products,
                // price: totalPrice,
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId } })
        })
        .then(([product]) => {
            if (product) {
                newQuantity = product.cartItem.quantity + 1;
                return product;
            }
            return Product.findByPk(productId)
        })
        .then (product => {
            return fetchedCart.addProduct(product, {
                through: {
                    quantity: newQuantity
                }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err))

    Product.findByPk(productId, product => {
        if (!product) res.redirect('/');
        Cart.addProduct(productId, product.price);
    });
    res.redirect('/cart');
};

exports.postCartDelete = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({where: { id : productId }});
        })
        .then(([product]) => {
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err))
}