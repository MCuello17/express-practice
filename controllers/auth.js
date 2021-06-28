exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login - My Shop!',
        pageID: 'login',
    });
};

exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true;
    res.redirect('/');
}