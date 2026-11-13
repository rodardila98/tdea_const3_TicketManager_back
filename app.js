const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Validación de variables de entorno obligatorias antes de iniciar el servidor
const variablesObligatorias = process.env.DATABASE_URL
    ? ['JWT_SECRET', 'DATABASE_URL']
    : ['JWT_SECRET', 'DB_PASSWORD', 'DB_DATABASE', 'DB_USER'];

const variablesFaltantes = variablesObligatorias.filter((variable) => !process.env[variable]);

if (variablesFaltantes.length > 0) {
    console.error(`\n❌ Error crítico: Faltan variables obligatorias en el archivo .env: ${variablesFaltantes.join(', ')}`);
    console.error('El servidor no puede arrancar sin esta configuración.\n');
    process.exit(1);
}

const sequelize = require('./src/config/database');
require('./src/models'); // Registra relaciones

const ticketRoutes = require('./src/routes/ticket.routes');
const usuarioRoutes = require('./src/routes/usuario.routes');

// Importar el middleware de errores
const errorHandler = require('./src/middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Cabeceras de seguridad HTTP básicas
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// 2. Configuración de CORS restringido a los orígenes del Frontend (Vite / Vercel)
const origenesPermitidos = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://tdea-const3-ticket-manager-front-flame.vercel.app',
    process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Permitir solicitudes sin origen (como Postman o curl)
        if (!origin) return callback(null, true);

        const originNormalizado = origin.replace(/\/$/, '');
        // Permitir orígenes autorizados, cualquier despliegue en Vercel (*.vercel.app) o en Render (*.onrender.com)
        if (
            origenesPermitidos.includes(originNormalizado) ||
            originNormalizado.endsWith('.vercel.app') ||
            originNormalizado.endsWith('.onrender.com')
        ) {
            callback(null, true);
        } else {
            callback(new Error('Acceso bloqueado por política de CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Montaje de rutas
app.use('/tickets', ticketRoutes);
app.use('/usuarios', usuarioRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Registrar el middleware de errores 
app.use(errorHandler);

// Sincronizar base de datos y arrancar servidor
sequelize.sync({ alter: true })
    .then(() => {
        console.log('\nBase de datos PostgreSQL conectada y modelos sincronizados con éxito');
        app.listen(PORT, () => {
            console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al sincronizar con la base de datos:', err);
    });
