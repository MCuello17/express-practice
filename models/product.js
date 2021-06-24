const products = []

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        products.push(this);
    }

    static fetchAll(callback) {
        callback(products);
        return products;
    }
}