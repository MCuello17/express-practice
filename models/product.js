const db = require('../utils/database');

module.exports = class Product {
    constructor(title, imageUrl, description, currency, price, stock) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.currency = currency;
        this.price = price;
        this.stock = stock;
    }

    save() {
        return db.execute('INSERT INTO products (title, price, currency, imageUrl, description) VALUES (?, ?, ?, ?, ?)',
        [
            this.title,
            this.price,
            this.currency,
            this.imageUrl,
            this.description,
        ]);
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
        return db.execute(`SELECT * FROM products WHERE id = ?`, [id]);
    }
}