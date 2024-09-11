import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from '../assets/img/DiamondLogo.png';
import navIcon1 from '../assets/img/nav-icon1.svg';
import gitIcon from '../assets/img/Git.png';
import navIcon3 from '../assets/img/nav-icon3.svg';
import '../css/navbar.css';
import { Github } from "react-bootstrap-icons";


const NavBar = () => {
    const [activeLink, setActiveLink] = useState('home');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        }

        window.addEventListener("scroll", onScroll);

        return () => window.removeEventListener("scroll", onScroll);
    }, [])

    const onUpdateActiveLink = (value) => {
        setActiveLink(value);
    }

    return (
        
        <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
            <Container>
                <div className="navbar-container">
                    <div className="navbar-brand">
                        <Navbar.Brand href="/">
                            <img src={logo} alt="Logo" />
                        </Navbar.Brand>
                    </div>
                    <div className="navbar-collapse">
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                                <Nav.Link href="#Home" className={activeLink === "home" ? "active navbar-link" : "navbar-link"} onClick={() => onUpdateActiveLink("home")}>Home </Nav.Link>
                                <Nav.Link href="#skills" className={activeLink === "skills" ? "active navbar-link" : "navbar-link"} onClick={() => onUpdateActiveLink("skills")}>skills </Nav.Link>
                                <Nav.Link href="#Proyects" className={activeLink === "projects" ? "active navbar-link" : "navbar-link"} onClick={() => onUpdateActiveLink("projects")}>Projects</Nav.Link>
                            </Nav>
                            <div className="social-icon">
                                <a href="https://www.linkedin.com/in/carlos-mateo-moreno-osorio/"><img src={navIcon1} alt="https://www.linkedin.com/in/carlos-mateo-moreno-osorio/" /></a>
                                <a href="https://github.com/DiamondStalker"><img src={gitIcon} alt="https://github.com/DiamondStalker" /></a>
                                <a href="#"><img src={navIcon3} alt="" /></a>
                            </div>
                        </Navbar.Collapse>
                    </div>
                </div>
            </Container>
        </Navbar>
    );

};

export default NavBar;
