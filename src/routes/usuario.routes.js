const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario.controller');

// Importa middlewares de seguridad
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

// Rutas públicas
router.post('/register', controller.register);
router.post('/login', controller.login);

// Rutas protegidas (exigen autenticación con JWT)
router.use(auth);

// Solo el rol 'admin' puede ver el directorio completo de usuarios
router.get('/', role(['admin']), controller.getAll);

// Un usuario puede consultar perfil por ID (el controlador valida que solo vea el propio, salvo admin)
router.get('/:id', role(['admin', 'agente']), controller.getById);

// Rutas exclusivas para administración de usuarios
router.put('/:id', role(['admin']), controller.update);
router.delete('/:id', role(['admin']), controller.delete);

module.exports = router;
