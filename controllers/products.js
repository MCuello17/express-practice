const { validationResult } = require('express-validator/check');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/product-form', {
        pageTitle: 'Create a new product - My Shop!',
        errorMessage: req.flash('error')[0],
    });
}

exports.postAddProduct = (req, res, next) => {
    const {title, imageUrl, description, currency, price, stock} = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/product-form', {
            pageTitle: 'Create a new product - My Shop!',
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
            oldInput: { 
                title: title,
                price: price,
                currency: currency,
                imageUrl: imageUrl,
                description: description,
                stock: stock,
            },
        });
    }

    req.user.createProduct({
        title: title,
        price: price,
        currency: currency,
        imageUrl: imageUrl,
        description: description,
        stock: stock,
    })
    .then(result => {
        res.redirect('/')
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render('shop/product-list', {
            products: products,
            pageID: 'shop',
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    // Product.findAll({where: {id: productId}}) => array of product/s
    Product.findByPk(productId)
    .then(product => {
        if (!product) {
            return res.status(404).render('error/404', {
                pageTitle: '404 - My Shop!',
            });
        }
        res.render('shop/product-details', {
            pageTitle: product.title,
            product: product,
            isFromUser: (product.userId === req.user.id),
        });
    })
    .catch(err => {{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }});
};

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    req.user
        .getProducts({where: {id: productId}})
        .then(([product]) => {
            if (!product) {
                return res.redirect('/admin/new-product');
            }
            res.render('admin/product-form', {
                pageTitle: 'Create a new product - My Shop!',
                product: product,
                errorMessage: req.flash('error')[0],
            });
        })
        .catch(err => {{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }});
};


exports.postEditProduct = (req, res, next) => {
    const {productId, title, imageUrl, description, currency, price, stock} = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/product-form', {
            pageTitle: 'Create a new product - My Shop!',
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
            oldInput: { 
                title: title,
                price: price,
                currency: currency,
                imageUrl: imageUrl,
                description: description,
                stock: stock,
            },
        });
    }

    req.user
        .getProducts({where: {id: productId}})
        .then(([product]) => {
            if (!product) res.redirect('/');
            product.title = title;
            product.imageUrl = imageUrl;
            product.description = description;
            product.currency = currency;
            product.price = price;
            product.stock = stock;
            return product.save();
        })
        .then(product => {
            res.redirect(`/products/${ product.id }`);
        })
        .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .getProducts({where: {id: productId}})
        .then(([product]) => {
            if (!product) res.redirect('/');
            return product.destroy();
        })
        .then(product => {
            res.redirect('/');
        })
        .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};

