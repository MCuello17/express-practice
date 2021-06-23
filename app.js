const express = require('express');

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

// Middleware with url filter (/users)
app.use('/users', (req, res, next) => {
    res.send(`<a href="/">Back</a>
        <form action="/new-user" method="POST">
            <label for="name">Full Name</label>
            <input type="text" name="name" placeholder="Juan Perez"/>
            <button type="submit">Crear</button>
        </form>
        <ul>
            <li>Juan Perez</li>
            <li>Lorem Ipsum</li>
            <li>María Testing</li>
        </ul>`);
});

// Middleware for POST requests at /new-user (simulate user creation)
app.post('/new-user', (req, res, next) => {
    console.log(req.body);
    res.redirect('/users');
});

// Middleware with url filter (/)
app.use('/', (req, res, next) => {
    res.send(`<a href="/users">User list</a>
        <h1>Index Page!</h1>`);
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