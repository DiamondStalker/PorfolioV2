import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { Card } from "./Cards";
import { useEffect, useState } from 'react'
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import Loading from './Loading'

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
                const sortedRepos = data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                    .filter(x => { return (!/(DiamondStalker|porfolio|Carlos_Mateo|readme|Portfolio)/gmi.test(x.name)) })
                    .slice(0, 15);

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


    if (loading) {
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
                                    <h2>Projects</h2>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                    <Tab.Container id="projects-tabs" defaultActiveKey="first">
                                        <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                                            <Nav.Item>
                                                <Nav.Link eventKey="first">Repository</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="second">Gits</Nav.Link>
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
                                                            {
                                                                repos.map((project, index) => {
                                                                    return (
                                                                        <Card
                                                                            key={index}
                                                                            {...project}
                                                                        />
                                                                    )
                                                                })
                                                            }
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