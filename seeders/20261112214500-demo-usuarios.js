'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hasheamos la contraseña por defecto para poder iniciar sesión desde el frontend
    const passwordHash = await bcrypt.hash('admin123*', 10);

    await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'Administrador General',
        email: 'admin@tdea.edu.co',
        password: passwordHash,
        role: 'admin'
      },
      {
        nombre: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@tdea.edu.co',
        password: passwordHash,
        role: 'agente'
      },
      {
        nombre: 'Rodrigo Ardila',
        email: 'rodrigo.ardila@tdea.edu.co',
        password: passwordHash,
        role: 'agente'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', {
      email: [
        'admin@tdea.edu.co',
        'carlos.rodriguez@tdea.edu.co',
        'rodrigo.ardila@tdea.edu.co'
      ]
    }, {});
  }
};
