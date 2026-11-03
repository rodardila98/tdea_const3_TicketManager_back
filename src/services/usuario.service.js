const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const jwtUtil = require('../utils/jwt');

// 1. Registro de usuario público: El servidor fuerza el rol por defecto ('agente')
exports.register = async (data) => {
    const hash = await bcrypt.hash(data.password, 10);
    
    // Evitamos escalada de privilegios ignorando cualquier campo 'role' recibido del cliente
    const nuevoUsuario = await Usuario.create({
        nombre: data.nombre,
        email: data.email,
        password: hash,
        role: 'agente' // Rol asignado exclusivamente por el servidor
    });

    const { password, ...usuarioSinPassword } = nuevoUsuario.toJSON();
    return usuarioSinPassword;
};

// 2. Inicio de sesión: Mismo mensaje para usuario no encontrado o contraseña incorrecta (evita enumeración)
exports.login = async (email, password) => {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401;
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

// 3. Listar usuarios (sin contraseñas)
exports.getAll = async () => {
    return await Usuario.findAll({
        attributes: { exclude: ['password'] }
    });
};

// 4. Obtener usuario por ID (sin contraseña)
exports.getById = async (id) => {
    return await Usuario.findByPk(id, {
        attributes: { exclude: ['password'] }
    });
};

// 5. Actualizar usuario: Excluye el hash de la contraseña en el retorno
exports.update = async (id, data) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;

    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }

    const usuarioActualizado = await usuario.update(data);
    const { password, ...usuarioSinPassword } = usuarioActualizado.toJSON();
    return usuarioSinPassword;
};

// 6. Eliminar usuario
exports.delete = async (id) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;
    await usuario.destroy();
    return true;
};
