'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     * 
     * 
     */

await queryInterface.createTable('usuarios', {
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
  } );
  
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
