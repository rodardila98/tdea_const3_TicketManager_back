const express = require('express');
const router = express.Router();
const controller = require('../controllers/ticket.controller');
const { validarCreacionTicket, validarActualizacionCompleta } = require('../middlewares/ticketValidator.middleware');

// CRUD REST completo para Tickets (Rúbrica: GET, POST, PUT, DELETE)
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validarCreacionTicket, controller.create);
router.put('/:id', validarActualizacionCompleta, controller.updateTotal);
router.patch('/:id', controller.updateStatus); // Mantenido para soporte del frontend existente
router.delete('/:id', controller.delete);

module.exports = router;
