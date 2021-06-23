const express = require('express');

const router = express.Router();

// Middleware with url filter (/)
router.get('/', (req, res, next) => {
    res.send(`<h1>Product list:</h1>
        <ul>
            <li>Cool Headphones</li>
            <li>Expensive Laptop</li>
            <li>Wireless Keyboard</li>
            <li><a href="/admin/new-product">Add new</a></li>
        </ul>`);
});

module.exports = router;