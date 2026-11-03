// Middleware para proteger rutas usando la función centralizada de verificación de JWT
const { verificarToken } = require('../utils/jwt');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Formato de token inválido' });
    }

    try {
        // Valida el token con el mismo secreto usado al crearlo
        const decoded = verificarToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
};
