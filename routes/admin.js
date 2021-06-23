const express = require('express');

const router = express.Router();

// Middleware with url filter (/users)
router.get('/new-product', (req, res, next) => {
    res.send(`<a href="/">Home</a>
        <form action="/admin/new-product" method="POST">
            <label for="name">Product Name</label>
            <input type="text" name="product" placeholder="Laptop case"/>
            <button type="submit">Crear</button>
        </form>`);
});

// Middleware for POST requests at /new-user (simulate user creation)
router.post('/new-product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;