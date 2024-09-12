import { GitFork, Eye, GitPullRequest } from 'lucide-react';
import { Button } from "flowbite-react";



export const Card = ({ id, name, description, updated_at, languages, eventsCount, watchers_count, forks_count, html_url }) => {

    languages = languages.filter(x => { return (!/batchfile|procfil|hack/gmi.test(x)) });

    return (

        <div key={id} style={{ background: '#12121283', border: '1px solid #ccc', padding: '20px', borderRadius: '10px', width: '250px' }}>
            <h3>{name.replaceAll('_', '-')}</h3>
            <p className='Language'>{languages.length > 0 ? (
                languages.map((temp) => {
                    //let srcIcon = `devicon-${temp.toLowerCase().replace('html','html5').replace('css','css3')}-plain colored`;//`https://cdn.simpleicons.org/${temp.toLowerCase().replace('html','html5').replace('css','css3')}`
                    let tempLanguahe = temp.toLowerCase()
                        .replace('html', 'html5')
                        .replace('css', 'css3')
                        .replace('shell', 'bash')
                        .replace('c++', 'cplusplus');

                    let srcIcon = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tempLanguahe}/${tempLanguahe}-original.svg`;//`https://cdn.simpleicons.org/${temp.toLowerCase().replace('html','html5').replace('css','css3')}`
                    return (
                        <img src={srcIcon} style={{
                            height: 32,
                            width: 32
                        }} />
                    )
                })
            ) : 'No languages detected'}</p>

            <p>{description}</p>
            <p>Last updated: {new Date(updated_at).toLocaleDateString()}</p>

            <div style={iconContainerStyles}>
                <p className='Pull'><GitPullRequest /> {eventsCount}</p>
                <p className='view' ><Eye /> {watchers_count}</p>
                <p className='Fork'><GitFork />{forks_count}</p>
            </div>

            <div className="buttonStyles">
                <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                    <a href={html_url} target="_blank" rel="noopener noreferrer" >
                        View Repository
                    </a>
                </button>

            </div>



        </div>
    )
}
// Estilos
const iconContainerStyles = {
    display: 'flex',
    justifyContent: 'space-around', // Espacio uniforme entre los elementos
    alignItems: 'center', // Alinea verticalmente los íconos
    marginTop: '10px',
};

export default Card;
