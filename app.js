const express = require('express');
const path = require('path');

const errorController = require('./controllers/errors');
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const CartItem = require('./models/cart-item');

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

// User Middleware
app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        // Global user in the request
        req.user = user;
        next();
    }).catch(err => console.log(err));
});

app.use(shopRoutes);
// Filtered router (all routes in router will start with '/admin')
app.use('/admin', adminRoutes);

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

// Enable auto-creation of tables for models
sequelize.sync({
    // force: true // To force new changes
// ---------------------------------------------------
//   CREATING A USER MANUALLY:
// ---------------------------------------------------
}).then(result => {

    // console.log(result);
    return User.findByPk(1);
    
}).then(user => {
    if (!user) {
        return User.create({
            name: "Michael",
            email: "michael@test.com"
        });
    }
    return Promise.resolve(user);
    
// ---------------------------------------------------
}).then(user => {
    // console.log(user);
    app.listen(port);
    console.log(`Listening on port ${port}`);
})
.catch(err => console.log(err));