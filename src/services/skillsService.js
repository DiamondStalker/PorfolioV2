/**
 * Servicio para manejar la conexión con la API real de MongoDB
 * Consume desde el backend Express + MongoDB Atlas
 */

class SkillsService {
    constructor() {
        this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutos
        
        console.log('🔗 SkillsService inicializado');
        console.log('📡 API Base URL:', this.baseUrl);
    }

    /**
     * Obtiene las skills desde MongoDB vía API
     */
    async getSkills() {
        try {
            console.log('📡 Fetching skills from MongoDB...');
            
            // Verificar cache primero
            const cachedData = this.getCachedData('skills');
            if (cachedData) {
                console.log('⚡ Usando skills desde cache');
                return cachedData;
            }

            const response = await fetch(`${this.baseUrl}/api/skills`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                signal: AbortSignal.timeout(10000)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('📊 Respuesta de MongoDB:', result);

            if (!result.success || !Array.isArray(result.data?.skills)) {
                throw new Error('Formato de respuesta inválido del backend');
            }

            const validatedSkills = this.validateSkills(result.data.skills);
            
            // Guardar en cache
            this.setCachedData('skills', validatedSkills);
            
            console.log(`✅ ${validatedSkills.length} skills cargadas desde MongoDB`);
            return validatedSkills;

        } catch (error) {
            console.error('❌ Error conectando a MongoDB:', error.message);
            console.warn('🔄 Usando skills por defecto como fallback');
            return this.getDefaultSkills();
        }
    }

    /**
     * Obtiene skills por categoría desde MongoDB
     */
    async getSkillsByCategory(category) {
        try {
            console.log(`📡 Fetching skills de categoría "${category}" desde MongoDB...`);
            
            const cachedData = this.getCachedData(`skills-${category}`);
            if (cachedData) {
                console.log('⚡ Usando skills de categoría desde cache');
                return cachedData;
            }

            const response = await fetch(`${this.baseUrl}api/skills/category/${category}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                signal: AbortSignal.timeout(10000)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log(`📊 Respuesta de MongoDB para categoría ${category}:`, result);

            if (!result.success || !Array.isArray(result.data?.skills)) {
                throw new Error('Formato de respuesta inválido del backend');
            }

            const validatedSkills = this.validateSkills(result.data.skills);

            this.setCachedData(`skills-${category}`, validatedSkills);
            console.log(`✅ ${validatedSkills.length} skills de categoría "${category}" cargadas desde MongoDB`);
            
            return validatedSkills;

        } catch (error) {
            console.error(`❌ Error obteniendo skills de categoría ${category}:`, error.message);
            console.warn('🔄 Usando skills por defecto filtradas como fallback');
            
            const defaultSkills = this.getDefaultSkills();
            return defaultSkills.filter(skill => 
                skill.category && skill.category.toLowerCase() === category.toLowerCase()
            );
        }
    }

    /**
     * Verificar conexión con el backend/MongoDB
     */
    async checkConnection() {
        try {
            const response = await fetch(`${this.baseUrl.replace('/api', '')}/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('🔗 Conexión a backend/MongoDB:', result.success ? '✅' : '❌');
                return result.success;
            }
            
            return false;
        } catch (error) {
            console.error('❌ Error verificando conexión:', error.message);
            return false;
        }
    }

    /**
     * Valida la estructura de las skills recibidas de MongoDB
     */
    validateSkills(skills) {
        if (!Array.isArray(skills)) {
            console.warn('⚠️ Skills recibidas no son array, usando fallback');
            return this.getDefaultSkills();
        }

        const validatedSkills = skills
            .filter(skill => skill && typeof skill === 'object')
            .map(skill => ({
                // Usar _id de MongoDB como id
                id: skill._id || skill.id || `skill-${Date.now()}-${Math.random()}`,
                name: skill.name || 'Skill sin nombre',
                proficiency: Math.min(Math.max(parseInt(skill.proficiency) || 0, 0), 100),
                category: skill.category || 'general',
                icon: skill.icon || 'Code2',
                description: skill.description || '',
                experience: skill.experience || '',
                tags: Array.isArray(skill.tags) ? skill.tags : [],
                priority: skill.priority || 0,
                isActive: skill.isActive !== false,
                lastUpdated: skill.updatedAt || skill.lastUpdated || new Date().toISOString(),
                // Agregar campos de MongoDB si existen
                _id: skill._id,
                createdAt: skill.createdAt,
                updatedAt: skill.updatedAt
            }))
            .filter(skill => skill.isActive); // Solo skills activas

        console.log(`✅ ${validatedSkills.length} skills validadas desde MongoDB`);
        return validatedSkills;
    }

    /**
     * Obtiene datos del cache si están vigentes
     */
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp < this.cacheExpiry)) {
            return cached.data;
        }
        return null;
    }

    /**
     * Guarda datos en cache
     */
    setCachedData(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Limpia todo el cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🧹 Cache limpiado');
    }

    /**
     * Skills por defecto (fallback) - Solo para casos de error
     */
    getDefaultSkills() {
        console.log('🔄 Usando skills por defecto (fallback)');
        
        return [
            {
                id: 'fallback-playwright',
                name: 'Playwright',
                proficiency: 95,
                category: 'testing',
                icon: 'Bot',
                description: 'Framework de automatización end-to-end (FALLBACK)',
                experience: '3+ años',
                tags: ['automation', 'e2e-testing'],
                priority: 10,
                lastUpdated: new Date().toISOString(),
                isActive: true
            },
            {
                id: 'fallback-js',
                name: 'JavaScript',
                proficiency: 95,
                category: 'languages',
                icon: 'Code2',
                description: 'Lenguaje principal para desarrollo web (FALLBACK)',
                experience: '5+ años',
                tags: ['web-development', 'programming'],
                priority: 10,
                lastUpdated: new Date().toISOString(),
                isActive: true
            },
            {
                id: 'fallback-karate',
                name: 'Karate Framework',
                proficiency: 90,
                category: 'testing',
                icon: 'Bot',
                description: 'Framework para testing de APIs (FALLBACK)',
                experience: '2+ años',
                tags: ['api-testing', 'automation'],
                priority: 9,
                lastUpdated: new Date().toISOString(),
                isActive: true
            }
        ];
    }
}

// Singleton instance
const skillsService = new SkillsService();

export default skillsService;
