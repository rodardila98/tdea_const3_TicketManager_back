const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    empresa: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El nombre de la empresa es obligatorio' }
        }
    },
    solicitante: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El nombre del solicitante es obligatorio' }
        }
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: { msg: 'El correo debe tener un formato válido' }
        }
    },
    celular: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El número celular es obligatorio' }
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'La descripción es obligatoria' }
        }
    },
    prioridad: {
        type: DataTypes.ENUM('Baja', 'Media', 'Alta'),
        defaultValue: 'Baja',
        validate: {
            isIn: {
                args: [['Baja', 'Media', 'Alta']],
                msg: 'La prioridad debe ser Baja, Media o Alta'
            }
        }
    },
    estado: {
        type: DataTypes.ENUM('Abierto', 'Asignado', 'En proceso', 'En espera', 'Resuelto', 'Cerrado', 'Cancelado'),
        defaultValue: 'Abierto',
        validate: {
            isIn: {
                args: [['Abierto', 'Asignado', 'En proceso', 'En espera', 'Resuelto', 'Cerrado', 'Cancelado']],
                msg: 'Estado inválido'
            }
        }
    }
}, {
    tableName: 'tickets',
    timestamps: true
});

module.exports = Ticket;
