const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario.controller');

// Importa middlewares existentes
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

// Rutas públicas
router.post('/register', controller.register);
router.post('/login', controller.login);

// Rutas protegidas (CRUD usuarios)
router.use(auth);
router.get('/', role(['admin', 'agente']), controller.getAll);
router.get('/:id', role(['admin', 'agente']), controller.getById);
router.put('/:id', role(['admin']), controller.update);
router.delete('/:id', role(['admin']), controller.delete);

module.exports = router;