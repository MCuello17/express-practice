const express = require('express');

const router = express.Router();

// (GET)/admin/new-product => New product form
router.get('/new-product', (req, res, next) => {
    res.send(`<a href="/">Home</a>
        <form action="/admin/new-product" method="POST">
            <label for="name">Product Name</label>
            <input type="text" name="product" placeholder="Laptop case"/>
            <button type="submit">Crear</button>
        </form>`);
});

// (POST)/admin/new-product => Creation of new product and redirect to /
router.post('/new-product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;