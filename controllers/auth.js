const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const User = require('../models/user');
const transpoerter = require('../utils/mailer')

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
        .then(([user]) => {
            if (user) {
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
                return transpoerter.sendMail({
                    to: email,
                    from: 'myshop@express.com',
                    subject: 'Signed up',
                    html: '<h1>Signed up!</h1>'
                });
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

exports.getResetPassword = (req, res, next) => {
    res.render('auth/password-reset', {
        pageTitle: 'Reset password - My Shop!',
        pageID: 'auth',
        errorMessage: req.flash('error')[0],
    });
}

exports.postResetPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset-password');
        }
        const token = buffer.toString('hex');
        User.findAll({where: { email: req.body.email }})
            .then(([user]) => {
                if (!user) {
                    return redirect('/reset-password')
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000; // NOW + 1 hour
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                return transpoerter.sendMail({
                    to: req.body.email,
                    from: 'myshop@express.com',
                    subject: 'Password reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click <a href="http://localhost:3000/reset-password/${ token }">this link</a> to set a new password</p>`
                })
            })
            .catch(err => console.log(err));
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findAll({ where: {
        resetToken: token,
        resetTokenExpiration: {[Op.gt]: Date.now()}
    }})
    .then(([user]) => {
        if (!user) {
            req.flash('error', 'Invalid token');
            return req.session.save((err) => {
                console.log(err);
                return res.redirect('/reset-password');
            });
        }
        res.render('auth/new-password', {
            pageTitle: 'Reset password - My Shop!',
            pageID: 'auth',
            errorMessage: req.flash('error')[0],
            userId: user.id,
            token: token,
        });
    })
    .catch(err => console.log(err));
}

exports.postNewPassword = (req, res, next) => {
    const {password: newPassword, token, userId} = req.body;
    let fetchedUser;
    User.findAll({ where: {
        id: userId,
        resetToken: token,
        resetTokenExpiration: {[Op.gt]: Date.now()},
    }})
    .then(([user]) => {
        if (!user) {
            req.flash('error', 'Invalid token');
            return req.session.save((err) => {
                console.log(err);
                return res.redirect('/reset-password');
            });
        }
        fetchedUser = user;
        return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
        fetchedUser.password = hashedPassword;
        fetchedUser.resetToken = null;
        fetchedUser.resetTokenExpiration = null;
        return fetchedUser.save();
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => console.log(err));
}
