const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El nombre es obligatorio' }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'El correo electrónico ya está registrado' },
        validate: {
            isEmail: { msg: 'Debe ingresar un correo electrónico válido' }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'La contraseña es obligatoria' }
        }
    },
    role: {
        type: DataTypes.ENUM('admin', 'agente'),
        defaultValue: 'agente'
    }
}, {
    tableName: 'usuarios',
    timestamps: false
});

module.exports = Usuario;
