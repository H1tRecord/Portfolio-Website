import '../styles/About.css';

function About() {
    const skills = [
        { name: 'PHP', icon: 'fab fa-php' },
        { name: 'Python', icon: 'fab fa-python' },
        { name: 'React', icon: 'fab fa-react' },
        { name: 'JavaScript', icon: 'fab fa-js' },
        { name: 'HTML5', icon: 'fab fa-html5' },
        { name: 'CSS3', icon: 'fab fa-css3-alt' }
    ];

    return (
        <section id="about" className="about">
            <div className="about-divider-top">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M602.45,3.86h0S572.9,116.24,281.94,120H923C632,116.24,602.45,3.86,602.45,3.86Z" className="shape-fill"></path>
                </svg>
            </div>

            <div className="about-content">
                <h2 className="about-title">About Me</h2>
                <p className="about-text">
                    I'm a passionate developer focused on creating engaging web experiences.
                    Currently pursuing IT, I balance my studies with hands-on development work.
                    I enjoy exploring new technologies and building projects that challenge me
                    to grow as a developer.
                </p>

                <div className="skills-grid">
                    {skills.map((skill, index) => (
                        <div key={skill.name} className="skill-card">
                            <i className={`${skill.icon} skill-icon`}></i>
                            <h3 className="skill-name">{skill.name}</h3>
                        </div>
                    ))}
                </div>
            </div>

            <div className="about-divider-bottom">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M1200 0L0 0 598.97 114.72 1200 0z" className="shape-fill"></path>
                </svg>
            </div>
        </section>
    );
}

export default About;