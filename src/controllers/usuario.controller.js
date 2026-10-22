const service = require('../services/usuario.service');

exports.register = async (req, res, next) => {
    try {
        const user = await service.register(req.body);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await service.login(email, password);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const data = await service.getAll();
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const data = await service.getById(req.params.id);
        if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const data = await service.update(req.params.id, req.body);
        if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario actualizado con éxito', usuario: data });
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const eliminado = await service.delete(req.params.id);
        if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario eliminado' });
    } catch (err) {
        next(err);
    }
};
