exports.get404 = (req, res, next) => {
    res.status(404).render('error/404', {
        pageTitle: '404 - My Shop!',
    });
}

exports.get500 = (error, req, res, next) => {
    res.status(500).render('error/500', {
        pageTitle: '500 - My Shop!',
    });
}