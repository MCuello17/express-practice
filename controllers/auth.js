const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login - My Shop!',
        pageID: 'login',
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    User.findByPk('1')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
                console.log(err);
                res.redirect('/');
            }); // TWe use the session.save method only when we need to excecute something AFTER the session info is saved.
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}