const service = require('../services/ticket.service');

exports.getAll = async (req, res, next) => {
    try {
        const tickets = await service.getAll(req.user);
        res.json(tickets);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const ticket = await service.getById(req.params.id, req.user);
        if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });
        res.json(ticket);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        // Asignamos el ticket al agente que lo crea por defecto, o el ID enviado si es admin
        const datosTicket = {
            ...req.body,
            usuarioId: req.body.usuarioId || (req.user.role === 'agente' ? req.user.id : null)
        };
        const nuevoTicket = await service.create(datosTicket);
        res.status(201).json(nuevoTicket);
    } catch (err) {
        next(err);
    }
};

// PUT /tickets/:id (Actualización total)
exports.updateTotal = async (req, res, next) => {
    try {
        const ticketActualizado = await service.updateTotal(req.params.id, req.body);
        if (!ticketActualizado) return res.status(404).json({ error: 'Ticket no encontrado' });
        res.json(ticketActualizado);
    } catch (err) {
        next(err);
    }
};

// PATCH /tickets/:id (Actualización de estado)
exports.updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const ticketActualizado = await service.updateStatus(id, estado, req.user);
        if (!ticketActualizado) return res.status(404).json({ error: 'Ticket no encontrado' });
        res.json(ticketActualizado);
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const eliminado = await service.delete(req.params.id);
        if (!eliminado) return res.status(404).json({ error: 'Ticket no encontrado' });
        res.json({ message: 'Ticket eliminado correctamente', id: req.params.id });
    } catch (err) {
        next(err);
    }
};
