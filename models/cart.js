const cart = {
    products: [],
    totalPrice: 0,
};

module.exports = class Cart {
    static addProduct(id, productPrice) {
        const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
        const existingProduct = cart.products[existingProductIndex];
        let updatedProduct;
        if (existingProduct) {
            updatedProduct = { ...existingProduct };
            updatedProduct.qty = updatedProduct.qty + 1;
            cart.products = [...cart.products];
            cart.products[existingProductIndex] = updatedProduct;
        } else {
            updatedProduct = {
                id: id,
                qty: 1,
            };
            cart.products = [...cart.products, updatedProduct];
        }

        cart.totalPrice = cart.totalPrice + +productPrice;
        console.log(cart);
    }

    static deleteProduct(id, productPrice) {
        const updatedCart = {...cart};
        const product = updatedCart.products.find(prod => prod.id === id);
        if (!product) return;
        const productQty = product.qty;

        cart.products = updatedCart.products.filter(prod => prod.id !== id);

        cart.totalPrice = cart.totalPrice - (productPrice * productQty);
    }

    static getCart (callback) {
        if (!cart.products) callback(null);
        callback(cart);
    }

}