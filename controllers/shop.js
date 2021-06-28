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
            console.log({cart});
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
                    quantity: newQuantity,
                    totalPrice: (product.price * newQuantity)
                }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err))
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
};

exports.getOrders = (req, res, next) => {
    res.redirect('/');
};

exports.postCheckout = (req, res, next) => {
    let fetchedProducts;
    let fetchecCart;
    req.user
        .getCart()
        .then(cart => {
            fetchecCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            fetchedProducts = products;
            return req.user.createOrder();
        })
        .then (order => {
            return order.addProducts(fetchedProducts.map(product => {
                product.orderItem = {
                    quantity: product.cartItem.quantity,
                    totalPrice: product.cartItem.totalPrice,
                };
                return product;
            }));
        })
        .then (result => {
            return fetchecCart.setProducts(null);
        })
        .then (result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err))
};