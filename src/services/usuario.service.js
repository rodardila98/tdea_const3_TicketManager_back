const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const jwtUtil = require('../utils/jwt');

exports.register = async (data) => {
    const hash = await bcrypt.hash(data.password, 10);
    const nuevoUsuario = await Usuario.create({
        ...data,
        password: hash
    });
    const { password, ...usuarioSinPassword } = nuevoUsuario.toJSON();
    return usuarioSinPassword;
};

exports.login = async (email, password) => {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 404;
        throw error;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401;
        throw error;
    }

    const token = jwtUtil.generarToken(user);
    const { password: _, ...datosUsuario } = user.toJSON();
    return { user: datosUsuario, token };
};

exports.getAll = async () => {
    return await Usuario.findAll({
        attributes: { exclude: ['password'] }
    });
};

exports.getById = async (id) => {
    return await Usuario.findByPk(id, {
        attributes: { exclude: ['password'] }
    });
};

exports.update = async (id, data) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;

    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }

    return await usuario.update(data);
};

exports.delete = async (id) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;
    await usuario.destroy();
    return true;
};
