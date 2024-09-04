import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import banner from '../assets/img/header-img.svg';
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import '../css/home.css';
import { ReactTyped } from "react-typed";


const Home = () => {
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const toRotate = ["Carlos Moreno", "DiamondStalker"];
    const [text, setText] = useState('');
    const [delta, setDelta] = useState(150);
    const period = 500;

    const tick = () => {
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updateText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);
        setText(updateText);

        if (isDeleting) {
            setDelta(prevDelta => prevDelta / 2);
        }

        if (!isDeleting && updateText === fullText) {
            setIsDeleting(true);
            setDelta(period);
        } else if (isDeleting && updateText === "") {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setDelta(1000);
        }
    };

    useEffect(() => {
        let ticker = setInterval(() => {
            tick();
        }, delta);

        return () => clearInterval(ticker);
    }, [text, delta, isDeleting, loopNum]);  // Incluye todas las dependencias

    return (
        <div className="tagline">
            <section className="banner" id="Home">
                <Container>
                    <Row className="align-items-center">
                        <Col xs={12} md={6}>
                            <TrackVisibility>
                                {({ isVisible }) =>
                                    <div className={`animate__animated ${isVisible ? 'animate__fadeIn' : ''}`}>
                                        <h1>Hi 👋, I'm {""}<br></br>
                                            <ReactTyped
                                                strings={["\n Carlos Moreno", "DiamondStalker"]}
                                                typeSpeed={100} loop backSpeed={50}
                                                className="current-text"
                                                //style={{ whiteSpace: 'pre-line', fontSize: '2em' }}
                                            />
                                        </h1>
                                        <h3>I am passionate about programming and video games.</h3>
                                    </div>
                                }
                            </TrackVisibility>
                        </Col>
                        <Col xs={12} md={6}>
                            <TrackVisibility>
                                {({ isVisible }) =>
                                    <div className={`animate__animated ${isVisible ? 'animate__zoomIn' : ''}`}>
                                        <img src={banner} alt="Banner" />
                                    </div>
                                }
                            </TrackVisibility>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default Home;
