const service = require('../services/ticket.service');

exports.getAll = async (req, res, next) => {
    try {
        const tickets = await service.getAll();
        res.json(tickets);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const ticket = await service.getById(req.params.id);
        if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });
        res.json(ticket);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const nuevoTicket = await service.create(req.body);
        res.status(201).json(nuevoTicket);
    } catch (err) {
        next(err);
    }
};

// PUT /tickets/:id
exports.updateTotal = async (req, res, next) => {
    try {
        const ticketActualizado = await service.updateTotal(req.params.id, req.body);
        if (!ticketActualizado) return res.status(404).json({ error: 'Ticket no encontrado' });
        res.json(ticketActualizado);
    } catch (err) {
        next(err);
    }
};

// PATCH /tickets/:id (para compatibilidad con frontend)
exports.updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        if (!estado) return res.status(400).json({ error: 'El campo estado es requerido' });

        const ticketActualizado = await service.updateStatus(id, estado);
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
