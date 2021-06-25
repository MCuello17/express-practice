const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/product-form', {
        pageTitle: 'Create a new product - My Shop!',
    });
}

exports.postAddProduct = (req, res, next) => {
    const {title, imageUrl, description, currency, price, stock} = req.body;
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
        res.render('shop/product-details', {
            pageTitle: product.title,
            product: product,
        });
    })
    .catch(err => {console.log(err)});
};

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findByPk(productId)
    .then(product => {
        if (!product) {
            return res.redirect('/admin/new-product');
        }
        res.render('admin/product-form', {
            pageTitle: 'Create a new product - My Shop!',
            product: product
        });
    })
    .catch(err => {console.log(err)});
};


exports.postEditProduct = (req, res, next) => {
    const {productId, title, imageUrl, description, currency, price, stock} = req.body;
    Product.findByPk(productId)
    .then(product => {
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
    .catch(err => console.log(err))
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByPk(productId)
    .then(product => {
        return product.destroy();
    })
    .then(product => {
        res.redirect('/');
    })
    .catch(err => console.log(err))
};

