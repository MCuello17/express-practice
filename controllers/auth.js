const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login - My Shop!',
        pageID: 'auth',
        isAuthenticated: req.session.isAuthenticated,
    });
};

exports.postLogin = (req, res, next) => {
    const {email, password} = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (!user) return res.redirect('/login');
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (!doMatch) return res.redirect('/login');
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
        isAuthenticated: req.session.isAuthenticated,
    });
};

exports.postSignup = (req, res, next) => {
    const {email, password, confirmPassword} = req.body;
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) return res.redirect('/signup');
            return bcrypt.hash(password, 12)
            .then(hashedPassword => {
                const user = new User({
                    email: email,
                    password: hashedPassword,
                    cart: {items: []}
                });
                return user.save();    
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