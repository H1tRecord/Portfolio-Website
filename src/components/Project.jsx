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

        // Create Intersection Observer after projects are loaded
        const setupObserver = () => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry, idx) => {
                        if (entry.isIntersecting) {
                            // Add visible class immediately for items already in view
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

        // Setup observer when projects are loaded
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
            <div className="project-waves-top">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="shape-fill"></path>
                </svg>
            </div>
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

                            {/* Language bar for each project */}
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
                                            {name}
                                            <span className="language-percentage">
                                                {percentage.toFixed(1)}%
                                            </span>
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