const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;

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

exports.verificarToken = (token) => {
    return jwt.verify(token, SECRET);
};