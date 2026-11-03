const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de conexión a PostgreSQL usando variables de entorno
const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD, // Sin contraseña quemada en código
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false
    }
);

module.exports = sequelize;
