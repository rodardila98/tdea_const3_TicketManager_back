// Middleware para validar datos de entrada antes de llegar al controlador
exports.validarCreacionTicket = (req, res, next) => {
    const { empresa, solicitante, correo, celular, descripcion } = req.body;
    const errores = [];

    if (!empresa || typeof empresa !== 'string' || !empresa.trim()) errores.push('El campo empresa es requerido.');
    if (!solicitante || typeof solicitante !== 'string' || !solicitante.trim()) errores.push('El campo solicitante es requerido.');
    if (!correo || !correo.includes('@')) errores.push('El campo correo debe ser una dirección de email válida.');
    if (!celular || typeof celular !== 'string' || !celular.trim()) errores.push('El campo celular es requerido.');
    if (!descripcion || typeof descripcion !== 'string' || !descripcion.trim()) errores.push('El campo descripción es requerido.');

    if (errores.length > 0) {
        return res.status(400).json({ error: 'Validación de datos fallida', detalles: errores });
    }

    next();
};

exports.validarActualizacionCompleta = (req, res, next) => {
    const { empresa, solicitante, correo, celular, descripcion, prioridad, estado } = req.body;
    const errores = [];

    if (!empresa) errores.push('El campo empresa es requerido para actualización total.');
    if (!solicitante) errores.push('El campo solicitante es requerido para actualización total.');
    if (!correo) errores.push('El campo correo es requerido para actualización total.');
    if (!celular) errores.push('El campo celular es requerido para actualización total.');
    if (!descripcion) errores.push('El campo descripción es requerido para actualización total.');

    if (errores.length > 0) {
        return res.status(400).json({ error: 'Validación de datos fallida', detalles: errores });
    }

    next();
};
