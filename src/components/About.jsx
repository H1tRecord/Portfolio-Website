import '../styles/About.css';
import { useEffect } from 'react';

function About() {
    const skills = {
        frontend: [
            { name: 'React', icon: 'fab fa-react' },
            { name: 'JavaScript', icon: 'fab fa-js' },
            { name: 'HTML5', icon: 'fab fa-html5' },
            { name: 'CSS3', icon: 'fab fa-css3-alt' }
        ],
        backend: [
            { name: 'PHP', icon: 'fab fa-php' },
            { name: 'Python', icon: 'fab fa-python' },
            { name: 'Node.js', icon: 'fab fa-node-js' }
        ],
        tools: [
            { name: 'Git', icon: 'fab fa-git-alt' },
            { name: 'Docker', icon: 'fab fa-docker' },
            { name: 'AWS', icon: 'fab fa-aws' }
        ]
    };

    const learningSkills = [
        { name: 'Next.js', icon: 'fab fa-react', description: 'React Framework' },
        { name: 'TypeScript', icon: 'fab fa-js', description: 'Someone End my Suffering' },
        { name: 'Vue.js', icon: 'fab fa-vuejs', description: 'Progressive Framework' }
    ];

    useEffect(() => {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.fade-in, .slide-in-left, .slide-in-right, .morph-in, .skill-card'
        );

        animatedElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section id="about" className="about">
            <div className="about-divider-top">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M602.45,3.86h0S572.9,116.24,281.94,120H923C632,116.24,602.45,3.86,602.45,3.86Z" className="shape-fill"></path>
                </svg>
            </div>

            <div className="about-content">
                <h2 className="about-title fade-in">About Me</h2>

                <div className="about-grid">
                    <div className="about-info">
                        <div className="intro-card about-card slide-in-left">
                            <div className="intro-header">
                                <img
                                    src="https://github.com/H1tRecord.png"
                                    alt="HitRecord"
                                    className="intro-avatar"
                                />
                                <h3>HitRecord</h3>
                            </div>
                            <div className="intro-content">
                                <p>Building modern web applications with a passion for clean code and user experience.</p>
                                <div className="intro-tags">
                                    <span><i className="fas fa-code"></i> Front-End Enjoyer</span>
                                    <span><i className="fas fa-wifi"></i> Terminally Online</span>
                                    <span><i className="fas fa-ban"></i> TypeScript Hater</span>
                                    <span><i className="fas fa-bomb"></i> Framework Destroyer</span>
                                </div>
                            </div>
                        </div>

                        <div className="about-card learning-card slide-in-left" style={{ animationDelay: '0.2s' }}>
                            <h3>Currently Learning</h3>
                            <div className="learning-list">
                                {learningSkills.map((skill, index) => (
                                    <div key={skill.name} className="learning-item" style={{ animationDelay: `${0.1 * index}s` }}>
                                        <i className={`${skill.icon} learning-icon`}></i>
                                        <div className="learning-info">
                                            <h4>{skill.name}</h4>
                                            <span>{skill.description}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="about-card slide-in-left" style={{ animationDelay: '0.4s' }}>
                            <h3>Interests</h3>
                            <div className="interests-grid">
                                <span><i className="fas fa-code"></i> Web Development</span>
                                <span><i className="fas fa-gamepad"></i> Gaming</span>
                                <span><i className="fas fa-server"></i> Backend</span>
                                <span><i className="fas fa-mobile-alt"></i> App Development</span>
                                <span><i className="fas fa-robot"></i> AI & ML</span>
                                <span><i className="fas fa-brush"></i> UI/UX Design</span>
                            </div>
                        </div>
                    </div>

                    <div className="skills-section slide-in-right">
                        <div className="skills-header">
                            <div className="skills-title-wrap">
                                <i className="fas fa-tools skills-icon"></i>
                                <h3 className="fade-in">Technical Skills</h3>
                            </div>
                            <p className="skills-subtitle">Technologies I work with</p>
                        </div>
                        {Object.entries(skills).map(([category, categorySkills], categoryIndex) => (
                            <div
                                key={category}
                                className="skill-category morph-in"
                                style={{ animationDelay: `${0.2 * categoryIndex}s` }}
                            >
                                <div className="category-header">
                                    <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                                    <span className="category-count">{categorySkills.length} tools</span>
                                </div>
                                <div className="skills-grid">
                                    {categorySkills.map((skill) => (
                                        <div key={skill.name} className="skill-card">
                                            <i className={`${skill.icon} skill-icon`}></i>
                                            <h3 className="skill-name">{skill.name}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;