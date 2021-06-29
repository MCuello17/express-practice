const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator/check')

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

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            pageTitle: 'Login - My Shop!',
            pageID: 'auth',
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
            oldInput: { email: email, password: password },
        });
    }

    User.findAll({where: {email: email}})
        .then(([user]) => {
            if (!user) {
                req.flash('error', 'Invalid email or password');
                return req.session.save((err) => {
                    return res.status(422).render('auth/login', {
                        pageTitle: 'Login - My Shop!',
                        pageID: 'auth',
                        errorMessage: "Invalid email or password",
                        validationErrors: [{param: 'email'}, {param: 'password'}],
                        oldInput: { email: email, password: password },
                    });
                });
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (!doMatch) {
                        return req.session.save((err) => {
                            return res.status(422).render('auth/login', {
                                pageTitle: 'Login - My Shop!',
                                pageID: 'auth',
                                errorMessage: "Invalid email or password",
                                validationErrors: [{param: 'email'}, {param: 'password'}],
                                oldInput: { email: email, password: password },
                            });
                        });
                    }
                    req.session.isAuthenticated = true;
                    req.session.user = user;
                    return req.session.save((err) => {
                        {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(error);
        return next(error);
    };
                        res.redirect('/');
                    }); // TWe use the session.save method only when we need to excecute something AFTER the session info is saved.
                })
                .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(error);
        return next(error);
    })
        })
        .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(error);
        return next(error);
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup - My Shop!',
        pageID: 'auth',
        errorMessage: req.flash('error')[0],
    });
};

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            pageTitle: 'Signup - My Shop!',
            pageID: 'auth',
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
            oldInput: { email: email, password: password, confirmPassword: confirmPassword },
        });
    }

    bcrypt.hash(password, 12)
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
        })
        .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(error);
        return next(error);
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(error);
        return next(error);
    };
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
            {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(error);
        return next(error);
    };
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
            .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(error);
        return next(error);
    });
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
                {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(error);
        return next(error);
    };
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
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(error);
        return next(error);
    });
}

exports.postNewPassword = (req, res, next) => {
    const {password: newPassword, token, userId, confirmPassword} = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/new-password', {
            pageTitle: 'Reset password - My Shop!',
            pageID: 'auth',
            userId: userId,
            token: token,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
            oldInput: { password: newPassword, confirmPassword: confirmPassword }
        });
    }

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
                {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(error);
        return next(error);
    };
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
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(error);
        return next(error);
    });
}
