import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { Card } from "./Cards";
import { useEffect, useState } from 'react'

import projImg1 from "../assets/img/project-img1.png";
import projImg2 from "../assets/img/project-img2.png";
import projImg3 from "../assets/img/project-img3.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Projects = () => {

    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const headers = {

                    Authorization: `token ${import.meta.env.VITE_GIT_TOKEN}`,
                };

                const response = await fetch('https://api.github.com/users/DiamondStalker/repos', { headers });
                const data = await response.json();

                // Ordenar los repositorios por fecha de actualización (de más reciente a más antiguo)
                const sortedRepos = data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 14);

                // Obtener lenguajes y eventos para cada repositorio
                const reposWithDetails = await Promise.all(
                    sortedRepos.map(async (repo) => {
                        const languagesResponse = await fetch(repo.languages_url, { headers });
                        const languagesData = await languagesResponse.json();

                        const eventsResponse = await fetch(repo.events_url, { headers });
                        const eventsData = await eventsResponse.json();

                        return {
                            ...repo,
                            languages: Object.keys(languagesData),
                            eventsCount: eventsData.length
                        };
                    })
                );

                setRepos(reposWithDetails);
            } catch (error) {
                console.error('Error fetching the repositories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();
    }, []);

    return (
        <section className="project" id="projects">
            <Container>
                <Row>
                    <Col size={12}>
                        <TrackVisibility>
                            {({ isVisible }) =>
                                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                                    <h2>Projects</h2>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                    <Tab.Container id="projects-tabs" defaultActiveKey="first">
                                        <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                                            <Nav.Item>
                                                <Nav.Link eventKey="first">Tab 1</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="second">Tab 2</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="third">Tab 3</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                        <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                                            <Tab.Pane eventKey="first">
                                                <center>
                                                    <Row>
                                                        <div id='Proyects' style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                            {repos.map((repo) => (
                                                                <div key={repo.id} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', width: '250px' }}>
                                                                    <h3>{repo.name}</h3>
                                                                    <p>{repo.description}</p>
                                                                    <p>Last updated: {new Date(repo.updated_at).toLocaleDateString()}</p>
                                                                    <p>Languages: {repo.languages.join(', ') || 'No languages detected'}</p>
                                                                    <p>Events: {repo.eventsCount}</p>
                                                                    <p>Watchers: {repo.watchers_count}</p>
                                                                    <p>Forks: {repo.forks_count}</p>
                                                                    <center>
                                                                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                                                            View Repository
                                                                        </a>
                                                                    </center>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Row>
                                                </center>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="second">
                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam, quod neque provident velit, rem explicabo excepturi id illo molestiae blanditiis, eligendi dicta officiis asperiores delectus quasi inventore debitis quo.</p>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="third">
                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam, quod neque provident velit, rem explicabo excepturi id illo molestiae blanditiis, eligendi dicta officiis asperiores delectus quasi inventore debitis quo.</p>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Tab.Container>
                                </div>}
                        </TrackVisibility>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Projects;