const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Validación de variables de entorno obligatorias antes de iniciar el servidor
const variablesObligatorias = ['JWT_SECRET', 'DB_PASSWORD', 'DB_DATABASE', 'DB_USER'];
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

// Middlewares globales
app.use(cors());
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
