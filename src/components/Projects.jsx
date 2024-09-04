import { useEffect, useState } from 'react'
import {gitToken} from '../../config.json'

const RepoList = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const headers = {
                    
                    Authorization: `token ${gitToken}`,
                };

                const response = await fetch('https://api.github.com/users/DiamondStalker/repos', { headers });
                const data = await response.json();

                // Ordenar los repositorios por fecha de actualización (de más reciente a más antiguo)
                const sortedRepos = data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0,14);

                // Obtener lenguajes y eventos para cada repositorio
                const reposWithDetails = await Promise.all(
                    sortedRepos.map(async (repo) => {
                        const languagesResponse = await fetch(repo.languages_url);
                        const languagesData = await languagesResponse.json();

                        const eventsResponse = await fetch(repo.events_url);
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
        return <p>Loading...</p>;
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {repos.map((repo) => (
                <div key={repo.id} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', width: '250px' }}>
                    <h3>{repo.name}</h3>
                    <p>{repo.description}</p>
                    <p>Last updated: {new Date(repo.updated_at).toLocaleDateString()}</p>
                    <p>Languages: {repo.languages.join(', ') || 'No languages detected'}</p>
                    <p>Events: {repo.eventsCount}</p>
                    <p>Watchers: {repo.watchers_count}</p>
                    <p>Forks: {repo.forks_count}</p>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        View Repository
                    </a>

                </div>
            ))}
        </div>
    );
};

export default RepoList;
