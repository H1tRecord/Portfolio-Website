import { useEffect, useState } from 'react';
import '../styles/Hero.css';

function Hero() {
    const [currentText, setCurrentText] = useState('');
    const [currentTime, setCurrentTime] = useState('Loading...');

    const phrases = [
        "Web Developer.",
        "Burnout IT Student.",
        "Aspiring Full Stack Developer.",
    ];

    useEffect(() => {
        const updateTime = () => {
            const options = {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: 'Asia/Manila',
            };
            setCurrentTime(new Date().toLocaleString('en-US', options));
        };

        updateTime();
        const intervalId = setInterval(updateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        let currentPhraseIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;

        const typeEffect = () => {
            const currentPhrase = phrases[currentPhraseIndex];

            if (!isDeleting && currentCharIndex < currentPhrase.length) {
                setCurrentText(currentPhrase.substring(0, currentCharIndex + 1));
                currentCharIndex++;
                setTimeout(typeEffect, 100);
            } else if (!isDeleting && currentCharIndex === currentPhrase.length) {
                setTimeout(() => {
                    isDeleting = true;
                    typeEffect();
                }, 2000);
            } else if (isDeleting && currentCharIndex > 0) {
                setCurrentText(currentPhrase.substring(0, currentCharIndex - 1));
                currentCharIndex--;
                setTimeout(typeEffect, 50);
            } else {
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                currentCharIndex = 0;
                setTimeout(typeEffect, 500);
            }
        };

        typeEffect();
    }, []);

    return (
        <section id="home" className="hero">
            <div className="hero-background">
                <div className="hero-waves-top">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                    </svg>
                </div>
            </div>
            <div className="hero-content">
                <div className="profile">
                    <div className="profile-pic-container">
                        <img src="https://github.com/H1tRecord.png" alt="Profile" className="profile-pic" />
                        <div className="info-cards">
                            <div className="info-card">
                                <i className="fas fa-clock"></i>
                                <span>{currentTime}</span>
                                <span>PHT</span>
                            </div>
                            <div className="info-card">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>Philippines</span>
                            </div>
                        </div>
                    </div>
                    <div className="profile-info">
                        <h1>HitRecord</h1>
                        <p className="subheader">
                            Hi, I'm HitRecord a <span className="typing">{currentText}</span>
                        </p>
                    </div>
                    <div className="social-icons">
                        <a href="https://twitter.com/HitRedcord" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://github.com/H1tRecord" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-github"></i>
                        </a>
                        <a href="https://www.youtube.com/@hitrecordyt" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-youtube"></i>
                        </a>
                        <a href="https://ko-fi.com/hitrecord" target="_blank" rel="noopener noreferrer">
                            <i className="fa-solid fa-circle-dollar-to-slot"></i>
                        </a>
                    </div>
                </div>
            </div>
            <a href="#about" className="scroll-down">
                <i className="fas fa-chevron-down"></i>
            </a>
            <div className="hero-waves-bottom">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="shape-fill"></path>
                </svg>
            </div>
        </section>
    );
}

export default Hero;