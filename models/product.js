const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    // title: Sequelize.STRING,
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    currency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '$',
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
});

module.exports = Product;