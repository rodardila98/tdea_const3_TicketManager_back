// Middleware centralizado de manejo de errores de Express
module.exports = (err, req, res, next) => {
    console.error('Error capturado por middleware:', err);

    // Errores de validación nativos de Sequelize
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        const errores = err.errors ? err.errors.map(e => e.message) : [err.message];
        return res.status(400).json({ error: 'Error de validación', detalles: errores });
    }

    const statusCode = err.statusCode || 500;
    const mensaje = err.message || 'Error interno del servidor';

    res.status(statusCode).json({ error: mensaje });
};
