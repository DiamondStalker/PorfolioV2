import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar'
import { Code2, Database, FileJson, Laptop, PenTool, Terminal } from 'lucide-react'
import { Bot, Cloud, Wrench } from 'lucide-react';


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

    { name: 'Git', proficiency: 90, icon: Wrench },

    { name: 'Puppeteer', proficiency: 100, icon: Bot },
    { name: 'Playwright', proficiency: 100, icon: Bot },

    { name: 'JavaScript', proficiency: 100, icon: Code2 },
    { name: 'Node.js', proficiency: 100, icon: Terminal },
    { name: 'React', proficiency: 90, icon: FileJson },
    { name: 'Java', proficiency: 70, icon: FileJson },
    { name: 'React', proficiency: 90, icon: FileJson },
    { name: 'C++', proficiency: 70, icon: FileJson },
    { name: 'Cobol', proficiency: 60, icon: Code2 },
    { name: 'Python', proficiency: 70, icon: Laptop },
    { name: 'Vite', proficiency: 65, icon: Database },
    { name: 'Flutter', proficiency: 65, icon: Database },


    { name: 'CSS', proficiency: 80, icon: PenTool },

    { name: 'SQL', proficiency: 90, icon: Database },
    { name: 'AWS', proficiency: 50, icon: Cloud },
    { name: 'AS400', proficiency: 50, icon: Database },
    { name: 'MongoDB', proficiency: 90, icon: Cloud },
    { name: 'Firebase', proficiency: 90, icon: Cloud },

    

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
                            <p>Throughout my experience as a developer, I have acquired and refined various skills that allow me to tackle complex challenges with efficient solutions. Some of my key competencies include:</p>
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