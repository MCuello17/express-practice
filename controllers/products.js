const products = [];

exports.getAddProduct = (req, res, next) => {
    res.render('new-product', {
        pageTitle: 'Create a new product - My Shop!',
    });
}

exports.postAddProduct = (req, res, next) => {
    products.push({title: req.body.title});
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    res.render('shop', {
        products: products,
        pageID: 'shop',
    });
}