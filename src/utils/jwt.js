const jwt = require('jsonwebtoken');
require('dotenv').config();

// Se obtiene el secreto directamente de las variables de entorno
const SECRET = process.env.JWT_SECRET;

// 1. Generar token firmado con expiración de 2 horas
exports.generarToken = (usuario) => {
    return jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            role: usuario.role
        },
        SECRET,
        { expiresIn: '2h' }
    );
};

// 2. Verificar y decodificar el token usando el mismo secreto centralizado
exports.verificarToken = (token) => {
    return jwt.verify(token, SECRET);
};
