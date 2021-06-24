const products = []

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
        this.id = Math.random().toString();
        products.push(this);
    }

    static fetchAll(callback) {
        callback(products);
        return products;
    }

    static findById(id, callback) {
        const product = products.find(p => p.id === id);
        callback(product);
        return product;
    }
}