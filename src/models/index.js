const Usuario = require('./usuario.model');
const Ticket = require('./ticket.model');

// Asociación opcional: Un usuario puede tener asignados varios tickets
Usuario.hasMany(Ticket, { foreignKey: 'usuarioId', as: 'tickets' });
Ticket.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'agenteAsignado' });

module.exports = {
    Usuario,
    Ticket
};