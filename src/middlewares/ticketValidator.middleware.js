// Constantes para validación de campos ENUM
const PRIORIDADES_VALIDAS = ['Baja', 'Media', 'Alta'];
const ESTADOS_VALIDOS = ['Abierto', 'Asignado', 'En proceso', 'En espera', 'Resuelto', 'Cerrado', 'Cancelado'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 1. Validar que el ID recibido por parámetro en la URL sea un entero positivo
exports.validarIdParam = (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'El ID debe ser un número entero positivo válido.' });
    }
    next();
};

// 2. Validar datos requeridos, tipos, longitudes y formatos al crear un ticket
exports.validarCreacionTicket = (req, res, next) => {
    const { empresa, solicitante, correo, celular, descripcion, prioridad } = req.body;
    const errores = [];

    if (!empresa || typeof empresa !== 'string' || !empresa.trim()) {
        errores.push('El campo empresa es requerido.');
    } else if (empresa.length > 100) {
        errores.push('El campo empresa no debe exceder 100 caracteres.');
    }

    if (!solicitante || typeof solicitante !== 'string' || !solicitante.trim()) {
        errores.push('El campo solicitante es requerido.');
    } else if (solicitante.length > 100) {
        errores.push('El campo solicitante no debe exceder 100 caracteres.');
    }

    if (!correo || typeof correo !== 'string' || !EMAIL_REGEX.test(correo.trim())) {
        errores.push('El campo correo debe ser una dirección de email válida (ej: usuario@dominio.com).');
    } else if (correo.length > 100) {
        errores.push('El campo correo no debe exceder 100 caracteres.');
    }

    if (!celular || typeof celular !== 'string' || !celular.trim()) {
        errores.push('El campo celular es requerido.');
    } else if (celular.length > 20) {
        errores.push('El campo celular no debe exceder 20 caracteres.');
    }

    if (!descripcion || typeof descripcion !== 'string' || !descripcion.trim()) {
        errores.push('El campo descripción es requerido.');
    } else if (descripcion.length > 1000) {
        errores.push('La descripción no debe exceder 1000 caracteres.');
    }

    if (prioridad && !PRIORIDADES_VALIDAS.includes(prioridad)) {
        errores.push(`La prioridad debe ser una de las siguientes: ${PRIORIDADES_VALIDAS.join(', ')}.`);
    }

    if (errores.length > 0) {
        return res.status(400).json({ error: 'Validación de datos fallida', detalles: errores });
    }

    next();
};

// 3. Validar cambio de estado en PATCH /tickets/:id
exports.validarCambioEstado = (req, res, next) => {
    const { estado } = req.body;

    if (!estado || typeof estado !== 'string' || !ESTADOS_VALIDOS.includes(estado)) {
        return res.status(400).json({
            error: 'Validación de estado fallida',
            detalles: [`El estado es requerido y debe ser uno de los siguientes: ${ESTADOS_VALIDOS.join(', ')}.`]
        });
    }

    next();
};

// 4. Validar actualización total en PUT /tickets/:id
exports.validarActualizacionCompleta = (req, res, next) => {
    const { empresa, solicitante, correo, celular, descripcion, prioridad, estado } = req.body;
    const errores = [];

    if (!empresa || typeof empresa !== 'string' || !empresa.trim() || empresa.length > 100) {
        errores.push('El campo empresa es requerido y debe tener máximo 100 caracteres.');
    }
    if (!solicitante || typeof solicitante !== 'string' || !solicitante.trim() || solicitante.length > 100) {
        errores.push('El campo solicitante es requerido y debe tener máximo 100 caracteres.');
    }
    if (!correo || typeof correo !== 'string' || !EMAIL_REGEX.test(correo.trim()) || correo.length > 100) {
        errores.push('El correo debe ser válido y tener máximo 100 caracteres.');
    }
    if (!celular || typeof celular !== 'string' || !celular.trim() || celular.length > 20) {
        errores.push('El celular es requerido y debe tener máximo 20 caracteres.');
    }
    if (!descripcion || typeof descripcion !== 'string' || !descripcion.trim() || descripcion.length > 1000) {
        errores.push('La descripción es requerida y debe tener máximo 1000 caracteres.');
    }
    if (prioridad && !PRIORIDADES_VALIDAS.includes(prioridad)) {
        errores.push(`La prioridad debe ser: ${PRIORIDADES_VALIDAS.join(', ')}.`);
    }
    if (estado && !ESTADOS_VALIDOS.includes(estado)) {
        errores.push(`El estado debe ser: ${ESTADOS_VALIDOS.join(', ')}.`);
    }

    if (errores.length > 0) {
        return res.status(400).json({ error: 'Validación de datos fallida', detalles: errores });
    }

    next();
};
