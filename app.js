const express = require('express');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const csrf = require('csurf');

const sequelize = require('./utils/database');
const errorController = require('./controllers/errors');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const isAuth = require('./middleware/is-auth');

const app = express();

// Templating engine setup
app.set('view engine', 'ejs');
app.set('views', 'views/pages');

// ---------------------------------------------------
// MIDDLEWARE SETUP EXAMPLE:
// ---------------------------------------------------
// app.use((req, res, next) => {
//     console.log("This is my first middleware!");
//     // Use next() to jump to the next middleware
//     next();
// });
// ---------------------------------------------------

// Parser Middleware
app.use(express.urlencoded({extended: true}));

// Staric files Middleware (public/*)
app.use(express.static(path.join(__dirname, 'public')));

// Session store
const store = new SequelizeStore({
    db: sequelize,
});

// Session Middleware
app.use(session({
    secret: 'super-secret secret',
    resave: false,
    saveUninitialized: false,
    store: store,
}));

// CSRF protection
const csrfProtection = csrf();
app.use(csrfProtection);

// User Middleware
app.use((req, res, next) => {
    if (!req.session.user) return next();
    console.log(req.session.user.id);
        User.findByPk(req.session.user.id)
            .then(user => {
                // Global user in the request
                req.user = user;
                return next();
            }).catch(err => console.log(err));
});

// Local variables. This variables are accesible from any view and part of the program
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use(shopRoutes);
app.use(authRoutes);

// Filtered router (all routes in router will start with '/admin')
app.use('/admin', isAuth, adminRoutes);

// 404 page Middleware 
app.use(errorController.get404);

// ---------------------------------------------------
//   OTHER HTTP REQUESTS THAT CAN BE USED WITH APP.:
// ---------------------------------------------------
// app.get()
// app.post()
// app.put()
// app.delete()
// etc...
// (https://expressjs.com/en/api.html#routing-methods)
// ---------------------------------------------------

const port = 3000;

// Relate models
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});

// Enable auto-creation of tables for models
sequelize.sync({
    // force: true // To force new changes
// ---------------------------------------------------
//   CREATING A USER MANUALLY:
// ---------------------------------------------------
// }).then(result => {

//     // console.log(result);
//     return User.findByPk(1);
    
// }).then(user => {
//     if (!user) {
//         return User.create({
//             name: "Michael",
//             email: "michael@test.com"
//         });
//     }
//     return Promise.resolve(user);
    
// }).then(user => {
//     user.createCart();
// ---------------------------------------------------
}).then(() => {
    app.listen(port);
    console.log(`Listening on port ${port}`);
})
.catch(err => console.log(err));