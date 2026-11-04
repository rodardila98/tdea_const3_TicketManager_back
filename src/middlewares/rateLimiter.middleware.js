// Middleware simple de límite de peticiones (Rate Limiter) en memoria
// Protege rutas sensibles (como login) contra ataques de fuerza bruta
const intentosPorIp = new Map();

module.exports = (maxIntentos = 10, ventanaMs = 15 * 60 * 1000) => {
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        const ahora = Date.now();

        const registro = intentosPorIp.get(ip);

        // Si es la primera petición o la ventana de tiempo expiró, reiniciamos el contador
        if (!registro || ahora - registro.inicio > ventanaMs) {
            intentosPorIp.set(ip, { cuenta: 1, inicio: ahora });
            return next();
        }

        // Si superó el número de intentos permitidos en la ventana de tiempo
        if (registro.cuenta >= maxIntentos) {
            return res.status(429).json({
                error: 'Demasiadas solicitudes. Por favor intenta más tarde.'
            });
        }

        registro.cuenta += 1;
        next();
    };
};
