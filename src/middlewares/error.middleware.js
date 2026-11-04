// Middleware centralizado de manejo de errores de Express
module.exports = (err, req, res, next) => {
    // 1. Registrar siempre el detalle técnico en los logs de la consola del servidor
    console.error('❌ Error capturado en el servidor:', err);

    // 2. Errores de validación nativos de Sequelize (400)
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        const errores = err.errors ? err.errors.map((e) => e.message) : [err.message];
        return res.status(400).json({ error: 'Error de validación', detalles: errores });
    }

    // 3. Errores de política de CORS (403)
    if (err.message === 'Acceso bloqueado por política de CORS') {
        return res.status(403).json({ error: err.message });
    }

    const statusCode = err.statusCode || 500;

    // 4. Errores internos de servidor (500): Ocultamos detalles técnicos de la BD o código al cliente
    if (statusCode >= 500) {
        return res.status(500).json({ error: 'Error interno del servidor. Por favor intenta más tarde.' });
    }

    // 5. Errores controlados de lógica de negocio (400, 401, 403, 404)
    res.status(statusCode).json({ error: err.message || 'Error en la solicitud' });
};
