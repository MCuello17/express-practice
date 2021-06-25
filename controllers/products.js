const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/new-product', {
        pageTitle: 'Create a new product - My Shop!',
    });
}

exports.postAddProduct = (req, res, next) => {
    const {title, imageUrl, description, currency, price, stock} = req.body;
    const product = new Product(title, imageUrl, description, currency, price, stock);
    product.save().then(() => {
        res.redirect('/');
    }).catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll().then(([rows, fieldData]) => {
        res.render('shop/product-list', {
            products: rows,
            pageID: 'shop',
        });
    }).catch(err => console.log(err));
}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId).then(([rows, fieldData]) => {
        if (rows.length <= 0) {
            return res.status(404).render('error/404', {
                pageTitle: '404 - My Shop!',
            });
        }
        const product = rows[0];
        res.render('shop/product-details', {
            pageTitle: product.title,
            product: product,
        });
    }).catch(err => console.log(err));
};