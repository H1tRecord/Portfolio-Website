import { useEffect, useState, useRef } from 'react';
import '../styles/Project.css';
import errorGif from '../assets/error.gif';

function Project() {
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tooltip, setTooltip] = useState({ content: '', visible: false, x: 0, y: 0 });
    const [sectionVisible, setSectionVisible] = useState(false);
    const sectionRef = useRef(null);

    const projectsPerPage = 6;
    const CACHE_DURATION = 1000 * 60 * 60 * 12; // 12 hour cache
    const lastFetchRef = useRef(0);
    const loadingRef = useRef(false);

    useEffect(() => {
        fetchProjects();

        const setupObserver = () => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry, idx) => {
                        if (entry.isIntersecting) {
                            const card = entry.target;
                            const cached = localStorage.getItem('githubProjects');
                            const delay = cached ? 0 : idx * 100;

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

            const cards = document.querySelectorAll('.project-card');
            cards.forEach(card => observer.observe(card));

            return observer;
        };

        let observer;
        if (!loading && projects.length > 0) {
            observer = setupObserver();
            const cached = localStorage.getItem('githubProjects');
            if (cached) {
                setTimeout(() => {
                    document.querySelectorAll('.project-card').forEach((card, idx) => {
                        card.classList.add('visible');
                    });
                }, 0);
            }
        }

        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    }, [loading, projects, currentPage]);

    useEffect(() => {
        const sectionObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setSectionVisible(true);
                    sectionObserver.disconnect();
                }
            },
            {
                threshold: 0.1
            }
        );

        if (sectionRef.current) {
            sectionObserver.observe(sectionRef.current);
        }

        return () => sectionObserver.disconnect();
    }, []);

    const fetchProjects = async () => {
        if (loadingRef.current) return;

        try {
            // Check cache first
            const cached = localStorage.getItem('githubProjects');
            const cacheTimestamp = localStorage.getItem('githubProjectsTimestamp');
            const now = Date.now();

            // If we have valid cache, use it
            if (cached && cacheTimestamp && now - Number(cacheTimestamp) < CACHE_DURATION) {
                const parsedData = JSON.parse(cached);
                setProjects(parsedData);
                setLoading(false);
                return;
            }

            // Throttle requests to once per minute
            if (now - lastFetchRef.current < 60000) {
                throw new Error('Please wait a moment before refreshing');
            }

            lastFetchRef.current = now;
            loadingRef.current = true;
            setLoading(true);

            const response = await fetch('https://api.github.com/users/H1tRecord/repos');
            if (!response.ok) {
                throw new Error(response.status === 403 ? 'Rate limit exceeded' : 'Failed to fetch repositories');
            }

            const data = await response.json();
            const projectsWithLanguages = await Promise.all(
                data.map(async (repo) => {
                    try {
                        // Check language cache
                        const langCache = localStorage.getItem(`lang_${repo.id}`);
                        if (langCache) {
                            return { ...repo, languages: JSON.parse(langCache) };
                        }

                        const langResponse = await fetch(repo.languages_url);
                        if (!langResponse.ok) return { ...repo, languages: [] };

                        const languages = await langResponse.json();
                        const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
                        const languagePercentages = Object.entries(languages)
                            .map(([name, bytes]) => ({
                                name,
                                percentage: (bytes / totalBytes) * 100
                            }))
                            .sort((a, b) => b.percentage - a.percentage);

                        // Cache language data
                        localStorage.setItem(`lang_${repo.id}`, JSON.stringify(languagePercentages));
                        return { ...repo, languages: languagePercentages };
                    } catch (err) {
                        return { ...repo, languages: [] };
                    }
                })
            );

            const sortedProjects = projectsWithLanguages.sort((a, b) =>
                b.stargazers_count - a.stargazers_count
            );

            // Cache the results
            localStorage.setItem('githubProjects', JSON.stringify(sortedProjects));
            localStorage.setItem('githubProjectsTimestamp', String(now));

            setProjects(sortedProjects);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to load projects');
            setProjects([]);

            // Use cached data as fallback if available
            const cached = localStorage.getItem('githubProjects');
            if (cached) {
                setProjects(JSON.parse(cached));
            }
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    };

    // Clean up old cache on mount
    useEffect(() => {
        const now = Date.now();
        const timestamp = localStorage.getItem('githubProjectsTimestamp');
        if (timestamp && now - Number(timestamp) > CACHE_DURATION) {
            localStorage.removeItem('githubProjects');
            localStorage.removeItem('githubProjectsTimestamp');
            // Clean up language caches
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('lang_')) {
                    localStorage.removeItem(key);
                }
            }
        }
    }, []);

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        setTimeout(() => {
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    };

    const handleLanguageHover = (e, language, percentage) => {
        const rect = e.target.getBoundingClientRect();
        setTooltip({
            content: language ? `${language} - ${percentage.toFixed(1)}%` : '✨ UNKNOWN MAGICAL CODE✨',
            visible: true,
            x: rect.left + (rect.width / 2),
            y: rect.top
        });
    };

    const handleLanguageLeave = () => {
        setTooltip(prev => ({ ...prev, visible: false }));
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisible = 5; // Maximum number of visible page buttons

        // Previous button
        buttons.push(
            <button
                key="prev"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-btn"
                aria-label="Previous page"
            >
                <i className="fas fa-chevron-left"></i>
            </button>
        );

        // Calculate range of pages to show
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        // First page
        if (startPage > 1) {
            buttons.push(
                <button
                    key={1}
                    onClick={() => paginate(1)}
                    className="page-btn number-btn"
                >
                    1
                </button>
            );
            if (startPage > 2) buttons.push(<span key="dots1" className="pagination-dots">...</span>);
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => paginate(i)}
                    className={`page-btn number-btn ${currentPage === i ? 'active' : ''}`}
                    aria-current={currentPage === i ? 'page' : undefined}
                >
                    {i}
                </button>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) buttons.push(<span key="dots2" className="pagination-dots">...</span>);
            buttons.push(
                <button
                    key={totalPages}
                    onClick={() => paginate(totalPages)}
                    className="page-btn number-btn"
                >
                    {totalPages}
                </button>
            );
        }

        // Next button
        buttons.push(
            <button
                key="next"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-btn"
                aria-label="Next page"
            >
                <i className="fas fa-chevron-right"></i>
            </button>
        );

        return buttons;
    };

    return (
        <section id="projects" className="projects" ref={sectionRef}>
            <div className="tooltip-container">
                {tooltip.visible && (
                    <div
                        className="tooltip"
                        style={{
                            left: `${tooltip.x}px`,
                            top: `${tooltip.y - 10}px`
                        }}
                    >
                        {tooltip.content}
                    </div>
                )}
            </div>
            <h2 className={sectionVisible ? 'visible' : ''}>Projects</h2>
            <p className={`section-caption ${sectionVisible ? 'visible' : ''}`}>
                A collection of my latest works and experiments
            </p>
            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner" aria-label="Loading projects"></div>
                    <p>Loading projects...</p>
                </div>
            ) : (
                <div className="projects-grid">
                    {error ? (
                        <div className="error-card">
                            <img
                                src={errorGif}
                                alt="Error illustration"
                                className="error-image"
                                width="300"
                                height="300"
                            />
                            <h3>Whoops! GitHub Rate Limit</h3>
                            <p className="error-message">
                                Looks like HitRecord broke GitHub's API rate limit for the 420th time trying to debug stuff
                                <br />
                                <span className="error-submessage">
                                    Don't worry though, you can still check out all my projects directly on GitHub
                                </span>
                            </p>
                            <div className="error-actions">
                                <a
                                    href="https://github.com/H1tRecord?tab=repositories"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="github-link"
                                >
                                    <i className="fab fa-github"></i> Browse Projects on GitHub
                                </a>
                                <button onClick={() => window.location.reload()} className="retry-btn">
                                    <i className="fas fa-sync-alt"></i> Refresh Page
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

                                <div className="languages-bar" role="list" aria-label="Project languages">
                                    {project.languages?.length > 0 ? (
                                        project.languages.map(({ name, percentage }) => (
                                            <div
                                                key={name}
                                                className="language-item"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: getLanguageColor(name)
                                                }}
                                                role="listitem"
                                                aria-label={`${name}: ${percentage.toFixed(1)}%`}
                                                onMouseEnter={(e) => handleLanguageHover(e, name, percentage)}
                                                onMouseLeave={handleLanguageLeave}
                                            />
                                        ))
                                    ) : (
                                        <div
                                            className="language-item rainbow"
                                            style={{ width: '100%' }}
                                            role="listitem"
                                            aria-label="Unknown language"
                                            onMouseEnter={(e) => handleLanguageHover(e, null, null)}
                                            onMouseLeave={handleLanguageLeave}
                                        />
                                    )}
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
            )}

            {!loading && !error && totalPages > 1 && (
                <div className="pagination" role="navigation" aria-label="Projects pagination">
                    {renderPaginationButtons()}
                </div>
            )}
        </section>
    );
}

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