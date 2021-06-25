const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/new-product', {
        pageTitle: 'Create a new product - My Shop!',
    });
}

exports.postAddProduct = (req, res, next) => {
    const {title, imageUrl, description, currency, price, stock} = req.body;
    Product.create({
        title: title,
        price: price,
        currency: currency,
        imageUrl: imageUrl,
        description: description,
        stock: stock,
    })
    .then(result => {
        console.log(result);
        res.redirect('/')
    })
    .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render('shop/product-list', {
            products: products,
            pageID: 'shop',
        });
    })
    .catch(err => console.log(err));
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
        console.log(product);
        res.render('shop/product-details', {
            pageTitle: product.title,
            product: product,
        });
    })
    .catch(err => {console.log(err)});
};