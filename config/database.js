// config/database.js
const { Sequelize } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE || "ticket_manager",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "12345",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "postgres",
        logging: false
    }
);

module.exports = sequelize;