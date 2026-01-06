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
const PORT = process.env.PORT || 3001;

// Middleware de seguridad
app.use(helmet({
    crossOriginEmbedderPolicy: false
}));

// Configuración CORS
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

// RUTAS DE SKILLS

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

// GET /api/skills/category/:category - Obtener skills por categoría
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

// GET /api/skills/stats - Obtener estadísticas
app.get('/api/skills/stats', async (req, res) => {
    try {
        const totalSkills = await Skill.countDocuments({ isActive: true });

        const avgResult = await Skill.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: null, avgProficiency: { $avg: '$proficiency' } } }
        ]);

        const categoryStats = await Skill.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgProficiency: { $avg: '$proficiency' },
                    maxProficiency: { $max: '$proficiency' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            data: {
                totalSkills,
                averageProficiency: avgResult[0]?.avgProficiency || 0,
                categoriesStats: categoryStats
            }
        });

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo estadísticas',
            error: error.message
        });
    }
});

// POST /api/skills - Crear nueva skill
app.post('/api/skills', async (req, res) => {
    try {
        const skillData = req.body;

        const escapeRegex = (text = '') =>
            text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const normalizedName = (skillData.name || '').trim();


        // Verificar si ya existe
        const existingSkill = await Skill.findOne({
            name: { $regex: new RegExp(`^${escapeRegex(normalizedName)}$`, 'i') }
        });

        if (existingSkill) {
            return res.status(409).json({
                success: false,
                statusCode: 409,
                message: 'Ya existe una skill con ese nombre'
            });
        }

        const skill = new Skill(skillData);
        await skill.save();

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Skill creada exitosamente',
            data: { skill }
        });

    } catch (error) {
        console.error('Error creando skill:', error);
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'Error creando skill',
            error: error.message
        });
    }
});

// PUT /api/skills/:id - Actualizar skill
app.put('/api/skills/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const skill = await Skill.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!skill) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Skill no encontrada'
            });
        }

        res.json({
            success: true,
            statusCode: 200,
            message: 'Skill actualizada exitosamente',
            data: { skill }
        });

    } catch (error) {
        console.error('Error actualizando skill:', error);
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'Error actualizando skill',
            error: error.message
        });
    }
});

// DELETE /api/skills/:id - Eliminar skill
app.delete('/api/skills/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const skill = await Skill.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!skill) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Skill no encontrada'
            });
        }

        res.json({
            success: true,
            statusCode: 200,
            message: 'Skill eliminada exitosamente',
            data: { skill }
        });

    } catch (error) {
        console.error('Error eliminando skill:', error);
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'Error eliminando skill',
            error: error.message
        });
    }
});

// Ruta de información de API
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Portfolio API v1.0.0',
        endpoints: {
            skills: '/api/skills',
            skillsByCategory: '/api/skills/category/:category',
            stats: '/api/skills/stats',
            health: '/health'
        }
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

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`📋 Health check: http://localhost:${PORT}/health`);
            console.log(`🎯 API Skills: http://localhost:${PORT}/api/skills`);
        });
    } catch (error) {
        console.error('❌ Error iniciando servidor:', error);
        process.exit(1);
    }
}

startServer();

export default app;
