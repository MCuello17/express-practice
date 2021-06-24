const express = require('express');
const path = require('path');

const errorController = require('./controllers/errors')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

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
app.listen(port);
console.log(`Listening on port ${port}`);