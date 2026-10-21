const { Ticket, Usuario } = require('../models');

exports.getAll = async () => {
    return await Ticket.findAll({
        order: [['id', 'DESC']],
        include: [{ model: Usuario, as: 'agenteAsignado', attributes: ['id', 'nombre', 'email'] }]
    });
};

exports.getById = async (id) => {
    return await Ticket.findByPk(id, {
        include: [{ model: Usuario, as: 'agenteAsignado', attributes: ['id', 'nombre', 'email'] }]
    });
};

exports.create = async (data) => {
    return await Ticket.create(data);
};

// PUT: Actualización completa del ticket
exports.updateTotal = async (id, data) => {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return null;
    return await ticket.update(data);
};

// PATCH: Actualización parcial del estado (para el frontend actual)
exports.updateStatus = async (id, estado) => {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return null;
    ticket.estado = estado;
    return await ticket.save();
};

exports.delete = async (id) => {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return null;
    await ticket.destroy();
    return true;
};
