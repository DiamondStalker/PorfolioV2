import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import Skill from './models/Skill.js';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware de seguridad
app.use(helmet({
    crossOriginEmbedderPolicy: false
}));

// Configuración CORS - CON DEBUG INCLUIDO
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'https://diamondstalker.github.io',
    'https://*.github.io',
    'https://*.onrender.com',
    /https:\/\/.*\.onrender\.com$/
];

// Logs de configuración CORS
console.log('🌐 CORS Configuration:');
console.log('📋 Allowed Origins:', allowedOrigins);
console.log('🔗 FRONTEND_URL:', process.env.FRONTEND_URL);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Middleware debug para CORS
app.use((req, res, next) => {
    // Solo loggear requests importantes
    if (req.method === 'OPTIONS' || req.path.includes('/api/')) {
        console.log('🌐 CORS Request:');
        console.log('  📡 Origin:', req.headers.origin || 'No origin header');
        console.log('  🎯 Method:', req.method);
        console.log('  📍 Path:', req.path);
        console.log('  🔑 User-Agent:', req.headers['user-agent']?.substring(0, 50) + '...');
        
        // Verificar si el origin está permitido
        const isAllowed = allowedOrigins.some(allowed => {
            if (typeof allowed === 'string') {
                return allowed === req.headers.origin;
            }
            if (allowed instanceof RegExp) {
                return allowed.test(req.headers.origin || '');
            }
            return false;
        });
        
        console.log('  ✅ Origin allowed:', isAllowed);
        console.log('---');
    }
    next();
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB Atlas
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME || 'portfolio'
        });
        console.log('✅ Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
}

// Endpoint de debug para CORS
app.get('/debug/cors', (req, res) => {
    const currentOrigin = req.headers.origin;
    const isAllowed = allowedOrigins.some(allowed => {
        if (typeof allowed === 'string') {
            return allowed === currentOrigin;
        }
        if (allowed instanceof RegExp) {
            return allowed.test(currentOrigin || '');
        }
        return false;
    });

    res.json({
        corsConfig: {
            allowedOrigins: allowedOrigins.map(origin => 
                origin instanceof RegExp ? origin.toString() : origin
            ),
            credentials: true
        },
        currentRequest: {
            origin: currentOrigin,
            isAllowed: isAllowed,
            method: req.method,
            path: req.path
        },
        environment: {
            FRONTEND_URL: process.env.FRONTEND_URL,
            NODE_ENV: process.env.NODE_ENV,
            PORT: PORT
        },
        headers: {
            origin: req.headers.origin,
            referer: req.headers.referer,
            userAgent: req.headers['user-agent']
        }
    });
});

// Health check
app.get('/health', async (req, res) => {
    try {
        await mongoose.connection.db.admin().ping();
        res.json({
            success: true,
            message: 'API funcionando correctamente',
            database: 'Conectado a MongoDB Atlas',
            environment: process.env.NODE_ENV || 'development',
            platform: 'Render',
            port: PORT,
            corsEnabled: true,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            message: 'Error de conexión a base de datos',
            error: error.message
        });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Portfolio Backend API v1.0.0',
        status: 'Running on Render',
        endpoints: {
            health: '/health',
            skills: '/api/skills',
            api: '/api',
            debugCors: '/debug/cors'
        }
    });
});

// GET /api/skills
app.get('/api/skills', async (req, res) => {
    try {
        const { category, sort = 'proficiency', order = 'desc' } = req.query;
        
        let filter = { isActive: true };
        if (category) {
            filter.category = category.toLowerCase();
        }

        const sortOrder = order === 'desc' ? -1 : 1;
        const sortObj = {};
        sortObj[sort] = sortOrder;

        const skills = await Skill.find(filter)
            .sort(sortObj)
            .select('-__v');

        res.json({
            success: true,
            statusCode: 200,
            message: 'Skills obtenidas exitosamente',
            data: {
                skills
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error obteniendo skills:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// GET /api/skills/category/:category
app.get('/api/skills/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        
        const skills = await Skill.find({ 
            category: category.toLowerCase(), 
            isActive: true 
        })
        .sort({ proficiency: -1, priority: -1 })
        .select('-__v');

        res.json({
            success: true,
            statusCode: 200,
            message: `Skills de la categoría ${category} obtenidas exitosamente`,
            data: {
                skills
            }
        });

    } catch (error) {
        console.error('Error obteniendo skills por categoría:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// API info
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Portfolio API v1.0.0 - Running on Render',
        endpoints: {
            skills: '/api/skills',
            skillsByCategory: '/api/skills/category/:category',
            health: '/health',
            debugCors: '/debug/cors'
        },
        platform: 'Render'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Ruta no encontrada'
    });
});

// Iniciar servidor
async function startServer() {
    try {
        await connectDB();
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🎨 Servidor Render corriendo en puerto ${PORT}`);
            console.log(`📋 Health: http://localhost:${PORT}/health`);
            console.log(`🎯 Skills: http://localhost:${PORT}/api/skills`);
            console.log(`🔍 Debug CORS: http://localhost:${PORT}/debug/cors`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Error iniciando servidor:', error);
        process.exit(1);
    }
}

startServer();

export default app;
