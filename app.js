const express = require('express');

const app = express();

// Middleware setup:
app.use((req, res, next) => {
    console.log("This is my first middleware!");
    // Use next() to jump to the next middleware
    next();
});

// Middleware with url filter (/users)
app.use('/users', (req, res, next) => {
    console.log("This is my users middleware!");
    res.send(`<a href="/">Back</a>
        <ul>
            <li>Juan Perez</li>
            <li>Lorem Ipsum</li>
            <li>María Testing</li>
        </ul>`);
});

// Middleware with url filter (/)
app.use('/', (req, res, next) => {
    console.log("This is my root middleware!");
    res.send(`<a href="/users">User list</a>
        <h1>Index Page!</h1>`);
});

const port = 3000;
app.listen(port);
console.log(`Listening on port ${port}`);