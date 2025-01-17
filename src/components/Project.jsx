import { useEffect, useState, useRef } from 'react';
import '../styles/Project.css';

function Project() {
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const projectsRef = useRef([]);

    const projectsPerPage = 6;

    useEffect(() => {
        fetchProjects();

        const setupObserver = () => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry, idx) => {
                        if (entry.isIntersecting) {
                            const card = entry.target;
                            const delay = idx * 100; // Stagger animation

                            setTimeout(() => {
                                card.classList.add('visible');
                            }, delay);

                            observer.unobserve(card);
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '50px'
                }
            );

            // Observe all project cards
            const cards = document.querySelectorAll('.project-card');
            cards.forEach(card => observer.observe(card));

            return observer;
        };

        let observer;
        if (!loading && projects.length > 0) {
            observer = setupObserver();
        }

        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    }, [loading, projects, currentPage]);

    const fetchProjects = async () => {
        try {
            const response = await fetch('https://api.github.com/users/H1tRecord/repos');
            const data = await response.json();

            // Fetch languages and sort by stars
            const projectsWithLanguages = await Promise.all(data.map(async (repo) => {
                const langResponse = await fetch(repo.languages_url);
                const languages = await langResponse.json();
                const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);

                const languagePercentages = Object.entries(languages).map(([name, bytes]) => ({
                    name,
                    percentage: (bytes / totalBytes) * 100
                })).sort((a, b) => b.percentage - a.percentage);

                return {
                    ...repo,
                    languages: languagePercentages
                };
            }));

            // Sort by stars
            const sortedProjects = projectsWithLanguages.sort((a, b) =>
                b.stargazers_count - a.stargazers_count
            );

            setProjects(sortedProjects);
            setLoading(false);
        } catch (err) {
            setError('Failed to load projects');
            setLoading(false);
        }
    };

    // Pagination logic
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    return (
        <section id="projects" className="projects">
            <h2>Projects</h2>
            <p className="section-caption">A collection of my latest works and experiments</p>
            <div className="projects-grid">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading projects...</p>
                    </div>
                ) : error ? (
                    <div className="error-card">
                        <i className="fas fa-exclamation-circle error-icon"></i>
                        <h3>Unable to Load Projects</h3>
                        <p>{error}</p>
                        <p className="error-subtext">This could be due to:</p>
                        <ul className="error-list">
                            <li>Network connectivity issues</li>
                            <li>GitHub API rate limiting</li>
                            <li>Server temporarily unavailable</li>
                        </ul>
                        <div className="error-actions">
                            <a
                                href="https://github.com/H1tRecord?tab=repositories"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="github-link"
                            >
                                <i className="fab fa-github"></i> View My GitHub Profile
                            </a>
                            <button onClick={fetchProjects} className="retry-btn">
                                <i className="fas fa-sync-alt"></i> Try Again
                            </button>
                        </div>
                    </div>
                ) : (
                    currentProjects.map((project, index) => (
                        <a
                            href={project.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-card"
                            key={project.id}
                            data-index={index}
                        >
                            <h3 className="project-title">{project.name}</h3>
                            <p className="project-description">{project.description || 'No description available'}</p>

                            {/* Update the languages bar section */}
                            <div className="languages-bar" role="list" aria-label="Project languages">
                                {project.languages?.map(({ name, percentage }) => (
                                    <div
                                        key={name}
                                        className="language-item"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: getLanguageColor(name)
                                        }}
                                        role="listitem"
                                        aria-label={`${name}: ${percentage.toFixed(1)}%`}
                                    >
                                        <div className="language-tooltip">
                                            {name} - {percentage.toFixed(1)}%
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="project-meta">
                                <div className="project-stats">
                                    <span><i className="far fa-star"></i> {project.stargazers_count}</span>
                                    <span><i className="fas fa-code-branch"></i> {project.forks_count}</span>
                                </div>
                                <span className="project-updated">
                                    Updated: {new Date(project.updated_at).toLocaleDateString()}
                                </span>
                            </div>
                        </a>
                    ))
                )}
            </div>

            {!loading && !error && (
                <div className="pagination">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="page-btn"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <span className="page-info">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="page-btn"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            )}
        </section>
    );
}

// Helper function to get language colors
function getLanguageColor(language) {
    const colors = {
        JavaScript: '#f1e05a',
        TypeScript: '#2b7489',
        HTML: '#e34c26',
        CSS: '#563d7c',
        Python: '#3572A5',
        Java: '#b07219',
        'C++': '#f34b7d',
        C: '#555555',
        'C#': '#178600',
        PHP: '#4F5D95',
        Ruby: '#701516',
        Swift: '#ffac45',
        Go: '#00ADD8',
        Rust: '#dea584',
        Kotlin: '#F18E33',
        Dart: '#00B4AB',
        Lua: '#000080',
        Shell: '#89e051',
        Vue: '#41b883',
        React: '#61dafb',
        'Jupyter Notebook': '#DA5B0B',
        Dockerfile: '#384d54'
    };
    return colors[language] || '#858585';
}

export default Project;