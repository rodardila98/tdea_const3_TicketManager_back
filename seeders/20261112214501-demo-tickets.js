'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtenemos los agentes existentes para vincularlos mediante usuarioId
    const agentes = await queryInterface.sequelize.query(
      `SELECT id, email FROM usuarios WHERE role = 'agente' ORDER BY id ASC;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const agente1Id = agentes[0] ? agentes[0].id : null;
    const agente2Id = agentes[1] ? agentes[1].id : agente1Id;

    const ahora = new Date();

    await queryInterface.bulkInsert('tickets', [
      {
        empresa: 'Tecnológico de Antioquia',
        solicitante: 'Andrés Cadavid',
        correo: 'andres.cadavid@tdea.com',
        celular: '3112223344',
        descripcion: 'Problemas de conexión con mi usuario en la plataforma',
        prioridad: 'Baja',
        estado: 'Abierto',
        usuarioId: agente1Id,
        createdAt: ahora,
        updatedAt: ahora
      },
      {
        empresa: 'Institución Universitaria TdeA',
        solicitante: 'Carlos Rodríguez',
        correo: 'carlos.rodriguez@tdea.edu.co',
        celular: '3009876543',
        descripcion: 'Fallo en la sincronización de notas en la plataforma institucional.',
        prioridad: 'Alta',
        estado: 'Abierto',
        usuarioId: agente1Id,
        createdAt: ahora,
        updatedAt: ahora
      },
      {
        empresa: 'Institución Universitaria TdeA - Sede Robledo',
        solicitante: 'Carlos Rodríguez M.',
        correo: 'carlos.rodriguez@tdea.edu.co',
        celular: '3119876543',
        descripcion: 'Fallo resuelto y revisado con el equipo técnico de soporte.',
        prioridad: 'Media',
        estado: 'En proceso',
        usuarioId: agente2Id,
        createdAt: ahora,
        updatedAt: ahora
      },
      {
        empresa: 'TechMax',
        solicitante: 'Alejandro Cadavid',
        correo: 'alejandro@techmax.com',
        celular: '3202399098',
        descripcion: 'Problemas de conectividad con el sistema de mesh instalado en el bloque B',
        prioridad: 'Alta',
        estado: 'Cerrado',
        usuarioId: agente2Id,
        createdAt: ahora,
        updatedAt: ahora
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tickets', {
      correo: [
        'andres.cadavid@tdea.com',
        'carlos.rodriguez@tdea.edu.co',
        'alejandro@techmax.com'
      ]
    }, {});
  }
};
