const express = require('express');

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const app = express();


// ---------------------------------------------------
// MIDDLEWARE SETUP EXAMPLE:
// ---------------------------------------------------
// app.use((req, res, next) => {
//     console.log("This is my first middleware!");
//     // Use next() to jump to the next middleware
//     next();
// });
// ---------------------------------------------------

// Parser middleware
app.use(express.urlencoded({extended: true}));

app.use(shopRoutes);
// Filtered router (all routes in router will start with '/admin')
app.use('/admin', adminRoutes);


app.use((req, res, next) => {
    res.status(404).send(`<h1>404</h1>
    <h2>Page not found</h2>`);
});

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