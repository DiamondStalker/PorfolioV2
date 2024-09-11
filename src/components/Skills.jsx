"use client"

import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar'
import { Code2, Database, FileJson, Laptop, PenTool, Terminal } from 'lucide-react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


const SkillBar = ({ skill, percentage, icon: Icon }) => (
    <div className='item'>
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
                <Icon className="w-8 h-8 text-white" />
                <div className="text-center mt-1">
                    <strong className="text-lg font-bold text-white">{percentage}%</strong>
                </div>
            </CircularProgressbarWithChildren>
            <h5>{skill}</h5>
        </div>
    </div>
)

const skills = [
    { name: 'React', proficiency: 90, icon: FileJson },
    { name: 'JavaScript', proficiency: 100, icon: Code2 },
    { name: 'CSS', proficiency: 80, icon: PenTool },
    { name: 'Node.js', proficiency: 75, icon: Terminal },
    { name: 'Python', proficiency: 70, icon: Laptop },
    { name: 'SQL', proficiency: 65, icon: Database },
]

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
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
    return (
        <section className='skill' id='skills'>
            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='skill-bx wow zoomIn'>
                            <h2>Skills</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam labore in alias quos error eos aperiam. Quam, ullam? At maxime fugiat eum placeat eius? Eligendi dolores quia magnam beatae repellat!</p>
                            <Carousel responsive={responsive} infinite={true} className="owl-carousel owl-theme skill-slider">
                                {skills.map((skill) => (
                                    <SkillBar key={skill.name} skill={skill.name} percentage={skill.proficiency} icon={skill.icon} />
                                ))}
                            </Carousel>
                        </div>
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
    )
}