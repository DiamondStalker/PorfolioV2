import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Skill from '../models/Skill.js';

// Configurar variables de entorno
dotenv.config();

// Skills iniciales basadas en tu perfil de QA Automation Engineer
const initialSkills = [
    // Testing & Automation
    {
        name: 'Playwright',
        proficiency: 95,
        category: 'testing',
        icon: 'Bot',
        description: 'Framework de automatización end-to-end para aplicaciones web modernas',
        experience: '3+ años',
        tags: ['automation', 'e2e-testing', 'web-testing', 'ci-cd'],
        priority: 10,
        isActive: true
    },
    {
        name: 'Karate Framework',
        proficiency: 90,
        category: 'testing',
        icon: 'Bot',
        description: 'Framework para testing de APIs y servicios web con DSL integrado',
        experience: '2+ años',
        tags: ['api-testing', 'dsl', 'bdd', 'automation'],
        priority: 9,
        isActive: true
    },
    {
        name: 'Puppeteer',
        proficiency: 88,
        category: 'testing',
        icon: 'Bot',
        description: 'Librería Node.js para controlar navegadores Chrome/Chromium',
        experience: '2+ años',
        tags: ['automation', 'web-scraping', 'headless-browser'],
        priority: 8,
        isActive: true
    },
    {
        name: 'JMeter',
        proficiency: 85,
        category: 'testing',
        icon: 'Zap',
        description: 'Herramienta para pruebas de carga y rendimiento',
        experience: '2+ años',
        tags: ['performance-testing', 'load-testing'],
        priority: 8,
        isActive: true
    },
    {
        name: 'Postman',
        proficiency: 90,
        category: 'testing',
        icon: 'Globe',
        description: 'Plataforma para desarrollo y testing de APIs',
        experience: '4+ años',
        tags: ['api-testing', 'rest', 'collections'],
        priority: 7,
        isActive: true
    },
    {
        name: 'Appium',
        proficiency: 80,
        category: 'testing',
        icon: 'Smartphone',
        description: 'Framework de automatización para aplicaciones móviles',
        experience: '1+ años',
        tags: ['mobile-testing', 'ios', 'android'],
        priority: 7,
        isActive: true
    },

    // Programming Languages
    {
        name: 'JavaScript',
        proficiency: 95,
        category: 'languages',
        icon: 'Code2',
        description: 'Lenguaje principal para desarrollo web y automatización',
        experience: '5+ años',
        tags: ['es6', 'async-await', 'promises', 'nodejs'],
        priority: 10,
        isActive: true
    },
    {
        name: 'Java',
        proficiency: 80,
        category: 'languages',
        icon: 'Code2',
        description: 'Lenguaje para desarrollo backend y automatización enterprise',
        experience: '3+ años',
        tags: ['oop', 'spring', 'maven', 'gradle'],
        priority: 8,
        isActive: true
    },
    {
        name: 'Python',
        proficiency: 75,
        category: 'languages',
        icon: 'Code2',
        description: 'Lenguaje versátil para scripting y automatización',
        experience: '2+ años',
        tags: ['scripting', 'automation', 'data-analysis'],
        priority: 7,
        isActive: true
    },

    // Frameworks & Libraries
    {
        name: 'React',
        proficiency: 85,
        category: 'frontend',
        icon: 'FileJson',
        description: 'Librería para construcción de interfaces de usuario',
        experience: '3+ años',
        tags: ['jsx', 'hooks', 'spa', 'components'],
        priority: 8,
        isActive: true
    },
    {
        name: 'Node.js',
        proficiency: 88,
        category: 'backend',
        icon: 'Terminal',
        description: 'Runtime de JavaScript para desarrollo backend',
        experience: '4+ años',
        tags: ['express', 'npm', 'async', 'microservices'],
        priority: 9,
        isActive: true
    },

    // Databases
    {
        name: 'MongoDB',
        proficiency: 85,
        category: 'database',
        icon: 'Database',
        description: 'Base de datos NoSQL orientada a documentos',
        experience: '3+ años',
        tags: ['nosql', 'aggregation', 'atlas', 'mongoose'],
        priority: 8,
        isActive: true
    },
    {
        name: 'Oracle Database',
        proficiency: 80,
        category: 'database',
        icon: 'HardDrive',
        description: 'Sistema de gestión de base de datos relacional enterprise',
        experience: '3+ años',
        tags: ['sql', 'plsql', 'performance-tuning', 'enterprise'],
        priority: 7,
        isActive: true
    },
    {
        name: 'SQL',
        proficiency: 90,
        category: 'database',
        icon: 'Database',
        description: 'Lenguaje estándar para gestión de bases de datos relacionales',
        experience: '4+ años',
        tags: ['queries', 'optimization', 'joins'],
        priority: 9,
        isActive: true
    },

    // DevOps & Cloud
    {
        name: 'AWS',
        proficiency: 70,
        category: 'devops',
        icon: 'Cloud',
        description: 'Plataforma de servicios en la nube de Amazon',
        experience: '2+ años',
        tags: ['ec2', 's3', 'lambda'],
        priority: 7,
        isActive: true
    },
    {
        name: 'Azure DevOps',
        proficiency: 85,
        category: 'devops',
        icon: 'Cloud',
        description: 'Conjunto de servicios de desarrollo colaborativo de Microsoft',
        experience: '2+ años',
        tags: ['pipelines', 'boards', 'repos', 'artifacts'],
        priority: 8,
        isActive: true
    },
    {
        name: 'Git',
        proficiency: 90,
        category: 'tools',
        icon: 'Wrench',
        description: 'Sistema de control de versiones distribuido',
        experience: '5+ años',
        tags: ['version-control', 'branching', 'merging'],
        priority: 9,
        isActive: true
    },
    {
        name: 'Docker',
        proficiency: 75,
        category: 'devops',
        icon: 'Monitor',
        description: 'Plataforma de contenerización para desarrollo y despliegue',
        experience: '1+ años',
        tags: ['containerization', 'microservices'],
        priority: 7,
        isActive: true
    },

    // Tools
    {
        name: 'Gradle',
        proficiency: 80,
        category: 'tools',
        icon: 'Wrench',
        description: 'Sistema de automatización de compilación y gestión de dependencias',
        experience: '2+ años',
        tags: ['build-automation', 'dependency-management'],
        priority: 6,
        isActive: true
    },
    {
        name: 'Vite',
        proficiency: 80,
        category: 'tools',
        icon: 'Zap',
        description: 'Herramienta de construcción y desarrollo frontend ultrarrápida',
        experience: '1+ años',
        tags: ['build-tool', 'frontend', 'hot-reload'],
        priority: 6,
        isActive: true
    }
];

async function seedDatabase() {
    try {
        console.log('🚀 Conectando a MongoDB Atlas...');
        
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME || 'portfolio'
        });
        
        console.log('✅ Conectado a MongoDB Atlas');
        
        // Limpiar skills existentes (opcional)
        const existingCount = await Skill.countDocuments();
        if (existingCount > 0) {
            console.log(`⚠️ Se encontraron ${existingCount} skills existentes`);
            await Skill.deleteMany({});
            console.log('🗑️ Skills existentes eliminadas');
        }
        
        // Insertar skills iniciales
        console.log(`📝 Insertando ${initialSkills.length} skills...`);
        
        const result = await Skill.insertMany(initialSkills);
        
        console.log(`✅ ${result.length} skills insertadas exitosamente`);
        
        // Obtener estadísticas
        const stats = await Skill.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgProficiency: { $avg: '$proficiency' }
                }
            },
            { $sort: { count: -1 } }
        ]);
        
        console.log('\n📊 Estadísticas por categoría:');
        stats.forEach(stat => {
            console.log(`  📂 ${stat._id}: ${stat.count} skills (promedio: ${Math.round(stat.avgProficiency)}%)`);
        });
        
        console.log('\n🎉 Base de datos poblada exitosamente');
        
    } catch (error) {
        console.error('❌ Error poblando la base de datos:', error);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Conexión cerrada');
        process.exit(0);
    }
}

seedDatabase();
