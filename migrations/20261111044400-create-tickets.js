'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tickets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      empresa: {
        type: Sequelize.STRING,
        allowNull: false
      },
      solicitante: {
        type: Sequelize.STRING,
        allowNull: false
      },
      correo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      celular: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      prioridad: {
        type: Sequelize.ENUM('Baja', 'Media', 'Alta'),
        defaultValue: 'Baja',
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM(
          'Abierto',
          'Asignado',
          'En proceso',
          'En espera',
          'Resuelto',
          'Cerrado',
          'Cancelado'
        ),
        defaultValue: 'Abierto',
        allowNull: false
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tickets');

    // En PostgreSQL, eliminamos los tipos ENUM creados para tickets
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_tickets_prioridad";');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_tickets_estado";');
    }
  }
};
