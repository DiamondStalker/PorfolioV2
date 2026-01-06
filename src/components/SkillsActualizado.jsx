import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar'
import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import skillsService from '../services/skillsService';
import Loading from './Loading';

// Importar iconos dinámicamente
import { 
    Code2, 
    Database, 
    FileJson, 
    Laptop, 
    PenTool, 
    Terminal, 
    Bot, 
    Cloud, 
    Wrench,
    Monitor,
    Smartphone,
    Globe,
    Shield,
    Zap,
    Cpu,
    HardDrive
} from 'lucide-react';

// Mapeo de nombres de iconos a componentes
const iconMap = {
    Code2,
    Database,
    FileJson,
    Laptop,
    PenTool,
    Terminal,
    Bot,
    Cloud,
    Wrench,
    Monitor,
    Smartphone,
    Globe,
    Shield,
    Zap,
    Cpu,
    HardDrive
};

const SkillBar = ({ skill, percentage, icon: iconName, description, experience }) => {
    // Obtener el componente del icono o usar uno por defecto
    const IconComponent = iconMap[iconName] || Code2;

    return (
        <div className='item' title={`${skill} - ${description}`}>
            <div className="w-32 h-32 mx-auto">
                <CircularProgressbarWithChildren
                    value={percentage}
                    strokeWidth={10}
                    styles={buildStyles({
                        strokeLinecap: 'round',
                        pathColor: `url(#purpleBlueGradient)`,
                        trailColor: 'rgba(255, 255, 255, 0.1)',
                    })}
                >
                    <IconComponent className="w-8 h-8 text-white" />
                    <div className="text-center mt-1">
                        <strong className="text-lg font-bold text-white">{percentage}%</strong>
                    </div>
                </CircularProgressbarWithChildren>
                <div className="text-center mt-2">
                    <h5 className="text-white font-semibold">{skill}</h5>
                    {experience && (
                        <p className="text-gray-300 text-sm">{experience}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

export default function Skills() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [retryCount, setRetryCount] = useState(0);

    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000;

    // Función para cargar skills
    const loadSkills = useCallback(async (isRetry = false) => {
        try {
            setLoading(true);
            setError(null);
            
            if (isRetry && retryCount > 0) {
                await new Promise(resolve => 
                    setTimeout(resolve, RETRY_DELAY * retryCount)
                );
            }

            let skillsData;
            if (selectedCategory === 'all') {
                skillsData = await skillsService.getSkills();
            } else {
                skillsData = await skillsService.getSkillsByCategory(selectedCategory);
            }

            if (skillsData && skillsData.length > 0) {
                // Ordenar skills por proficiencia (mayor a menor)
                const sortedSkills = skillsData.sort((a, b) => b.proficiency - a.proficiency);
                setSkills(sortedSkills);
                setRetryCount(0);
            } else {
                setSkills([]);
            }

        } catch (error) {
            const errorMessage = `Error cargando skills: ${error.message}`;
            setError(errorMessage);
            
            // Reintentar automáticamente si no se han agotado los intentos
            if (retryCount < MAX_RETRIES) {
                setRetryCount(prev => prev + 1);
                setTimeout(() => loadSkills(true), RETRY_DELAY * (retryCount + 1));
            }
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, retryCount]);

    // Cargar skills al montar el componente
    useEffect(() => {
        loadSkills();
    }, [loadSkills]);

    // Función para reintentar manualmente
    const handleRetry = () => {
        setRetryCount(0);
        loadSkills();
    };

    // Obtener categorías únicas disponibles
    const getUniqueCategories = () => {
        const categories = ['all', ...new Set(skills.map(skill => skill.category))];
        return categories;
    };

    // Filtrar skills por categoría
    const filteredSkills = selectedCategory === 'all' 
        ? skills 
        : skills.filter(skill => skill.category === selectedCategory);

    // Componente de error
    const ErrorDisplay = () => (
        <Alert variant="danger" className="mx-3">
            <Alert.Heading>Error de Conexión</Alert.Heading>
            <p>{error}</p>
            <p className="mb-0">
                <small className="text-muted">
                    Mostrando skills por defecto. Intentos: {retryCount}/{MAX_RETRIES}
                </small>
            </p>
            <hr />
            <div className="d-flex justify-content-end">
                <button 
                    className="btn btn-outline-danger"
                    onClick={handleRetry}
                    disabled={loading}
                >
                    {loading ? 'Reintentando...' : 'Reintentar'}
                </button>
            </div>
        </Alert>
    );

    // Mostrar loading
    if (loading && skills.length === 0) {
        return (
            <section className='skill' id='skills'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-12'>
                            <center>
                                <Loading />
                            </center>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='skill' id='skills'>
            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='skill-bx wow zoomIn'>
                            <h2>Habilidades Técnicas</h2>
                            <p>
                                A lo largo de mi experiencia como QA Automation Engineer, he adquirido y 
                                perfeccionado diversas habilidades técnicas que me permiten abordar desafíos 
                                complejos con soluciones eficientes. Mis competencias principales incluyen:
                            </p>
                            
                            {/* Mostrar error si existe, pero seguir mostrando contenido */}
                            {error && <ErrorDisplay />}
                            
                            {/* Filtros de categoría */}
                            {getUniqueCategories().length > 1 && (
                                <div className="category-filters mb-4">
                                    <div className="d-flex justify-content-center flex-wrap gap-2">
                                        {getUniqueCategories().map(category => (
                                            <button
                                                key={category}
                                                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                                                onClick={() => setSelectedCategory(category)}
                                            >
                                                {category === 'all' ? 'Todas' : category.charAt(0).toUpperCase() + category.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Carousel de skills */}
                            {filteredSkills.length > 0 ? (
                                <Carousel 
                                    responsive={responsive} 
                                    infinite={true} 
                                    className="owl-carousel owl-theme skill-slider"
                                    autoPlay={true}
                                    autoPlaySpeed={3000}
                                    keyBoardControl={true}
                                    showDots={false}
                                    removeArrowOnDeviceType={["tablet", "mobile"]}
                                >
                                    {filteredSkills.map((skill) => (
                                        <SkillBar 
                                            key={skill.id}
                                            skill={skill.name} 
                                            percentage={skill.proficiency} 
                                            icon={skill.icon}
                                            description={skill.description}
                                            experience={skill.experience}
                                        />
                                    ))}
                                </Carousel>
                            ) : (
                                <Alert variant="info" className="text-center">
                                    {selectedCategory === 'all' 
                                        ? 'No hay habilidades disponibles en este momento.'
                                        : `No hay habilidades disponibles en la categoría "${selectedCategory}".`
                                    }
                                </Alert>
                            )}
                            
                            {/* Estadísticas adicionales
                            {filteredSkills.length > 0 && (
                                <div className="skills-stats mt-4">
                                    <div className="row text-center">
                                        <div className="col-md-4">
                                            <h4 className="text-primary">{filteredSkills.length}</h4>
                                            <p className="text-muted">Habilidades</p>
                                        </div>
                                        <div className="col-md-4">
                                            <h4 className="text-primary">
                                                {Math.round(filteredSkills.reduce((acc, skill) => acc + skill.proficiency, 0) / filteredSkills.length)}%
                                            </h4>
                                            <p className="text-muted">Promedio de Competencia</p>
                                        </div>
                                        <div className="col-md-4">
                                            <h4 className="text-primary">
                                                {new Set(skills.map(skill => skill.category)).size}
                                            </h4>
                                            <p className="text-muted">Categorías</p>
                                        </div>
                                    </div>
                                </div>
                            )} */}
                        </div>
                        
                        {/* Gradiente SVG */}
                        <svg style={{ height: 0 }}>
                            <defs>
                                <linearGradient id="purpleBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#8B5CF6" />
                                    <stop offset="100%" stopColor="#3B82F6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}
