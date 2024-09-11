import { Col } from "react-bootstrap";
import projImg1 from "../assets/img/project-img1.png";


export const Card = ({ name, description,updated_at,languages ,eventsCount,watchers_count,forks_count,html_url}) => {
    return (
        <Col size={12} sm={6} md={4}>
            <div className="proj-imgbx">
                <img src={projImg1} />
                <div className="proj-txtx">
                    <h4>{name}</h4>
                    <span>{description}</span>
                    <p>Last updated: {new Date(updated_at).toLocaleDateString()}</p>
                    <p>Languages: {languages.join(', ') || 'No languages detected'}</p>
                    <p>Events: {eventsCount}</p>
                    <p>Watchers: {watchers_count}</p>
                    <p>Forks: {forks_count}</p>
                </div>
            </div>
            <a href={html_url} target="_blank" rel="noopener noreferrer">
                        View Repository
                    </a>
        </Col>
    )
}

export default Card;