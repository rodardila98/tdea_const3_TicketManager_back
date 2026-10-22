const express = require('express');
const router = express.Router();
const controller = require('../controllers/ticket.controller');

// Middlewares de seguridad y validación
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const { 
    validarCreacionTicket, 
    validarActualizacionCompleta 
} = require('../middlewares/ticketValidator.middleware');

// OBLIGATORIO: Todas las rutas de tickets a partir de aquí exigen Token (JWT)
router.use(auth);

// Rutas accesibles tanto por Admin como por Agentes
router.get('/', role(['admin', 'agente']), controller.getAll);
router.get('/:id', role(['admin', 'agente']), controller.getById);
router.post('/', role(['admin', 'agente']), validarCreacionTicket, controller.create);
router.patch('/:id', role(['admin', 'agente']), controller.updateStatus);

// Rutas críticas restringidas exclusivamente al rol Admin
router.put('/:id', role(['admin']), validarActualizacionCompleta, controller.updateTotal);
router.delete('/:id', role(['admin']), controller.delete);

module.exports = router;