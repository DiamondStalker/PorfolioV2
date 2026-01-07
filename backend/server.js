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
const PORT = process.env.PORT || 10000; // Render usa puerto 10000 por defecto

// Middleware de seguridad
app.use(helmet({
    crossOriginEmbedderPolicy: false
}));

// Configuración CORS - ACTUALIZADA PARA RENDER
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requests por IP
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
            api: '/api'
        }
    });
});

// GET /api/skills - Obtener todas las skills
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

// Ruta de información de API
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Portfolio API v1.0.0 - Running on Render',
        endpoints: {
            skills: '/api/skills',
            skillsByCategory: '/api/skills/category/:category',
            health: '/health'
        },
        platform: 'Render'
    });
});

// Manejo de rutas no encontradas
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
            console.log(`📋 Health check: http://localhost:${PORT}/health`);
            console.log(`🎯 API Skills: http://localhost:${PORT}/api/skills`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Error iniciando servidor:', error);
        process.exit(1);
    }
}

startServer();

export default app;
