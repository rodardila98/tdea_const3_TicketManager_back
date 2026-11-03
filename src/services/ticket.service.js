const { Ticket, Usuario } = require('../models');

// 1. Obtener tickets: Si es agente solo ve los asignados a él; si es admin ve todos
exports.getAll = async (user) => {
    const where = {};
    if (user.role !== 'admin') {
        where.usuarioId = user.id;
    }

    return await Ticket.findAll({
        where,
        order: [['id', 'DESC']],
        include: [{ model: Usuario, as: 'agenteAsignado', attributes: ['id', 'nombre', 'email'] }]
    });
};

// 2. Obtener ticket por ID: Valida pertenencia para agentes
exports.getById = async (id, user) => {
    const ticket = await Ticket.findByPk(id, {
        include: [{ model: Usuario, as: 'agenteAsignado', attributes: ['id', 'nombre', 'email'] }]
    });

    if (!ticket) return null;

    if (user.role !== 'admin' && ticket.usuarioId !== user.id) {
        const error = new Error('No tienes permiso para consultar este ticket');
        error.statusCode = 403;
        throw error;
    }

    return ticket;
};

// 3. Crear ticket
exports.create = async (data) => {
    return await Ticket.create(data);
};

// 4. PUT: Actualización completa del ticket (restringido a admin desde rutas)
exports.updateTotal = async (id, data) => {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return null;
    return await ticket.update(data);
};

// 5. PATCH: Actualización parcial del estado con validación de pertenencia para agentes
exports.updateStatus = async (id, estado, user) => {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return null;

    // Si es un agente, solo puede modificar tickets asignados a él
    if (user.role !== 'admin' && ticket.usuarioId !== user.id) {
        const error = new Error('No tienes permiso para modificar este ticket');
        error.statusCode = 403;
        throw error;
    }

    ticket.estado = estado;
    return await ticket.save();
};

// 6. Eliminar ticket
exports.delete = async (id) => {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return null;
    await ticket.destroy();
    return true;
};
