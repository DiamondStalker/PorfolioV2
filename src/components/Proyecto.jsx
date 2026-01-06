import { Container, Row, Col, Tab, Nav, Alert } from "react-bootstrap";
import { Card } from "./Cards";
import { Gists } from './Gits';
import { useEffect, useState, useCallback } from 'react';
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import Loading from './Loading';

export const Proyecto = () => {
    // Estados separados para mejor control
    const [repos, setRepos] = useState([]);
    const [gists, setGists] = useState([]);
    const [loading, setLoading] = useState({ repos: true, gists: true });
    const [errors, setErrors] = useState({ repos: null, gists: null });
    const [retryCount, setRetryCount] = useState({ repos: 0, gists: 0 });

    // Configuración
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000;
    const MAX_REPOS = 15;

    // Función para manejar delay en reintentos
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Función para filtrar repositorios
    const filterRepositories = (repos) => {
        return repos.filter(repo => 
            !/(DiamondStalker|porfolio|Carlos_Mateo|readme|Portfolio)/gmi.test(repo.name)
        );
    };

    // Fetch de repositorios con manejo robusto de errores
    const fetchRepos = useCallback(async (isRetry = false) => {
        try {
            setLoading(prev => ({ ...prev, repos: true }));
            
            if (isRetry && retryCount.repos < MAX_RETRIES) {
                await delay(RETRY_DELAY * (retryCount.repos + 1));
            }

            const response = await fetch('https://api.github.com/users/DiamondStalker/repos', {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Portfolio-App'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error('Formato de respuesta inválido');
            }

            // Procesar y filtrar repositorios
            const filteredRepos = filterRepositories(data);
            const sortedRepos = filteredRepos
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                .slice(0, MAX_REPOS);

            // Obtener detalles adicionales de forma segura
            const reposWithDetails = await Promise.allSettled(
                sortedRepos.map(async (repo) => {
                    try {
                        const [languagesResponse, eventsResponse] = await Promise.all([
                            fetch(repo.languages_url, {
                                headers: {
                                    'Accept': 'application/vnd.github.v3+json',
                                    'User-Agent': 'Portfolio-App'
                                }
                            }),
                            fetch(repo.events_url, {
                                headers: {
                                    'Accept': 'application/vnd.github.v3+json',
                                    'User-Agent': 'Portfolio-App'
                                }
                            })
                        ]);

                        const languagesData = languagesResponse.ok ? 
                            await languagesResponse.json() : {};
                        const eventsData = eventsResponse.ok ? 
                            await eventsResponse.json() : [];

                        return {
                            ...repo,
                            languages: Object.keys(languagesData),
                            eventsCount: Array.isArray(eventsData) ? eventsData.length : 0
                        };
                    } catch (error) {
                        // Si falla obtener detalles, devolver repo básico
                        return {
                            ...repo,
                            languages: [],
                            eventsCount: 0
                        };
                    }
                })
            );

            // Filtrar resultados exitosos
            const successfulRepos = reposWithDetails
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value);

            setRepos(successfulRepos);
            setErrors(prev => ({ ...prev, repos: null }));
            setRetryCount(prev => ({ ...prev, repos: 0 }));

        } catch (error) {
            const errorMessage = `Error al cargar repositorios: ${error.message}`;
            setErrors(prev => ({ ...prev, repos: errorMessage }));
            
            // Reintentar automáticamente si no se han agotado los intentos
            if (retryCount.repos < MAX_RETRIES) {
                setRetryCount(prev => ({ ...prev, repos: prev.repos + 1 }));
                setTimeout(() => fetchRepos(true), RETRY_DELAY * (retryCount.repos + 1));
            } else {
                setRepos([]); // Establecer array vacío en caso de falla final
            }
        } finally {
            setLoading(prev => ({ ...prev, repos: false }));
        }
    }, [retryCount.repos]);

    // Fetch de gists con manejo robusto de errores
    const fetchGists = useCallback(async (isRetry = false) => {
        try {
            setLoading(prev => ({ ...prev, gists: true }));
            
            if (isRetry && retryCount.gists < MAX_RETRIES) {
                await delay(RETRY_DELAY * (retryCount.gists + 1));
            }

            const response = await fetch('https://api.github.com/users/DiamondStalker/gists', {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Portfolio-App'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error('Formato de respuesta inválido');
            }

            setGists(data);
            setErrors(prev => ({ ...prev, gists: null }));
            setRetryCount(prev => ({ ...prev, gists: 0 }));

        } catch (error) {
            const errorMessage = `Error al cargar gists: ${error.message}`;
            setErrors(prev => ({ ...prev, gists: errorMessage }));
            
            if (retryCount.gists < MAX_RETRIES) {
                setRetryCount(prev => ({ ...prev, gists: prev.gists + 1 }));
                setTimeout(() => fetchGists(true), RETRY_DELAY * (retryCount.gists + 1));
            } else {
                setGists([]);
            }
        } finally {
            setLoading(prev => ({ ...prev, gists: false }));
        }
    }, [retryCount.gists]);

    // Función para reintentar manualmente
    const handleRetry = (type) => {
        if (type === 'repos') {
            setRetryCount(prev => ({ ...prev, repos: 0 }));
            fetchRepos();
        } else if (type === 'gists') {
            setRetryCount(prev => ({ ...prev, gists: 0 }));
            fetchGists();
        }
    };

    // Efecto inicial
    useEffect(() => {
        fetchRepos();
        fetchGists();
    }, [fetchRepos, fetchGists]);

    // Componente de error con opción de reintento
    const ErrorDisplay = ({ error, type, onRetry }) => (
        <Alert variant="danger" className="mx-3">
            <Alert.Heading>Error de Conexión</Alert.Heading>
            <p>{error}</p>
            <hr />
            <div className="d-flex justify-content-end">
                <button 
                    className="btn btn-outline-danger"
                    onClick={() => onRetry(type)}
                    disabled={loading[type]}
                >
                    {loading[type] ? 'Reintentando...' : 'Reintentar'}
                </button>
            </div>
        </Alert>
    );

    // Mostrar loading mientras ambos están cargando
    if (loading.repos && loading.gists && !errors.repos && !errors.gists) {
        return (
            <center>
                <Loading />
            </center>
        );
    }

    return (
        <section className="project" id="projects">
            <Container>
                <Row>
                    <Col size={12}>
                        <TrackVisibility>
                            {({ isVisible }) =>
                                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                                    <h2>Proyectos</h2>
                                    <p>
                                        Aquí encontrarás una colección de mis proyectos más recientes en GitHub 
                                        y algunos Gists que he creado. Estos proyectos reflejan mi trabajo más 
                                        reciente en diferentes áreas del desarrollo de software.
                                    </p>
                                    
                                    <Tab.Container id="projects-tabs" defaultActiveKey="repos">
                                        <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                                            <Nav.Item>
                                                <Nav.Link eventKey="repos">
                                                    Repositorios {loading.repos && <span className="spinner-border spinner-border-sm ms-2" />}
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="gists">
                                                    Gists {loading.gists && <span className="spinner-border spinner-border-sm ms-2" />}
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                        
                                        <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                                            <Tab.Pane eventKey="repos">
                                                {errors.repos ? (
                                                    <ErrorDisplay 
                                                        error={errors.repos} 
                                                        type="repos" 
                                                        onRetry={handleRetry}
                                                    />
                                                ) : (
                                                    <center>
                                                        <Row>
                                                            <div id="Projects" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                                {repos.length > 0 ? (
                                                                    repos.map((project, index) => (
                                                                        <Card
                                                                            key={`${project.id}-${index}`}
                                                                            {...project}
                                                                        />
                                                                    ))
                                                                ) : (
                                                                    !loading.repos && (
                                                                        <Alert variant="info">
                                                                            No se encontraron repositorios para mostrar.
                                                                        </Alert>
                                                                    )
                                                                )}
                                                            </div>
                                                        </Row>
                                                    </center>
                                                )}
                                            </Tab.Pane>
                                            
                                            <Tab.Pane eventKey="gists">
                                                {errors.gists ? (
                                                    <ErrorDisplay 
                                                        error={errors.gists} 
                                                        type="gists" 
                                                        onRetry={handleRetry}
                                                    />
                                                ) : (
                                                    <Row>
                                                        <div id="Gists" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                            {gists.length > 0 ? (
                                                                gists.map((gist, index) => (
                                                                    <Gists
                                                                        key={`${gist.id}-${index}`}
                                                                        {...gist}
                                                                    />
                                                                ))
                                                            ) : (
                                                                !loading.gists && (
                                                                    <Alert variant="info">
                                                                        No se encontraron gists para mostrar.
                                                                    </Alert>
                                                                )
                                                            )}
                                                        </div>
                                                    </Row>
                                                )}
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Tab.Container>
                                </div>
                            }
                        </TrackVisibility>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Proyecto;
