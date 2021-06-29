const fs = require('fs');
const path = require('path');

const Product = require("../models/product");
const Order = require("../models/order");

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
        .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(error);
        return next(error);
    });
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
        .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(error);
        return next(error);
    })
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
        .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(error);
        return next(error);
    })
};

exports.postCheckout = (req, res, next) => {
    let fetchedProducts;
    let fetchecCart;
    let orderId;
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
            orderId = order.id;
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
            res.redirect(`/orders/${orderId}`);
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            console.log(error);
            return next(error);
    })
};

exports.getOrderInvoice = (req, res, next) => {
    const orderId = req.params.orderId;

    return Order.findByPk(orderId)
        .then(order => {
            console.log({order});
            if (!order) return next(new Error("No order found"));
            if (order.userId !== req.user.id) return next(new Error("Unauthorized"));
            const invoiceName = `invoice-${orderId}.pdf`;
            const invoicePath = path.join('data', 'invoices', invoiceName);
        
            fs.readFile(invoicePath, (err, data) => {
                if (err) return next(err);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename="My Shop - ${ invoiceName }"`);
                return res.send(data);
            });
        })
        .catch(err => next(err));
};