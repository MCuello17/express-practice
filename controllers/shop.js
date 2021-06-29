const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

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

    // let fetchedOrder;

    return Order.findByPk(orderId)
        .then(order => {
            if (!order) return next(new Error("No order found"));
            if (order.userId !== req.user.id) return next(new Error("Unauthorized"));

            return order.getProducts()
        })
        .then(products => {
            const invoiceName = `invoice-${orderId}.pdf`;
            const invoicePath = path.join('data', 'invoices', invoiceName);
            const pdfDoc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="My Shop - ${ invoiceName }"`);
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text("Invoice", {
                underline: true
            });

            pdfDoc.text('-----------------------');

            let totalPrice = 0;
            products.forEach(product => {
                totalPrice = totalPrice + product.orderItem.totalPrice;
                pdfDoc.fontSize(16).text(`${product.title} (${product.orderItem.quantity} x ${product.currency + product.price}) - ${product.currency + product.orderItem.totalPrice}`);
            });
            pdfDoc.fontSize(26).text('-----------------------');
            pdfDoc.fontSize(20).text(`Total: $${totalPrice}`);

            pdfDoc.end();
         
            // Another way of serving files
            // fs.readFile(invoicePath, (err, data) => {
            //     if (err) return next(err);
            //     res.setHeader('Content-Type', 'application/pdf');
            //     res.setHeader('Content-Disposition', `inline; filename="My Shop - ${ invoiceName }"`);
            //     return res.send(data);
            // });

            // Streaming a file
            // const file = fs.createReadStream(invoicePath);
            // res.setHeader('Content-Type', 'application/pdf');
            // res.setHeader('Content-Disposition', `inline; filename="My Shop - ${ invoiceName }"`);
            // file.pipe(res);

        })
        .catch(err => next(err));
};