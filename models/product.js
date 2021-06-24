const products = [
    {
        id: "1",
        title: "Sample product",
        imageUrl: "https://www.zdnet.com/a/hub/i/2021/02/28/7687e3eb-9509-4a63-8efc-bb7a4048e818/framework-laptop-modular-upgrade-upgradeable-repair-notebook.jpg",
        description: "This is a sample product.",
        currency: "$",
        price: "1500",
        stock: "5",
    }
]

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