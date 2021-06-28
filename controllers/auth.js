const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login - My Shop!',
        pageID: 'auth',
        errorMessage: req.flash('error')[0],
    });
};

exports.postLogin = (req, res, next) => {
    const {email, password} = req.body;
    User.findAll({where: {email: email}})
        .then(([user]) => {
            if (!user) {
                req.flash('error', 'Invalid email or password');
                return req.session.save((err) => {
                    console.log(err);
                    return res.redirect('/login');
                });
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (!doMatch) {
                        req.flash('error', 'Invalid email or password');
                        return req.session.save((err) => {
                            console.log(err);
                            return res.redirect('/login');
                        });
                    }
                    req.session.isAuthenticated = true;
                    req.session.user = user;
                    return req.session.save((err) => {
                        console.log(err);
                        res.redirect('/');
                    }); // TWe use the session.save method only when we need to excecute something AFTER the session info is saved.
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err));
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup - My Shop!',
        pageID: 'auth',
        errorMessage: req.flash('error')[0],
    });
};

exports.postSignup = (req, res, next) => {
    const {email, password, confirmPassword} = req.body;
    User.findAll({where: {email: email}})
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Email already exists');
                return req.session.save((err) => {
                    console.log(err);
                    return res.redirect('/signup');
                });
            }
            return bcrypt.hash(password, 12)
            .then(hashedPassword => {
                return User.create({
                    email: email,
                    password: hashedPassword,
                });
            })
            .then(user => {
                return user.createCart();
            })
            .then(result => {
                res.redirect('/login')
            });
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}