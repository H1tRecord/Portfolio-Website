import React, { useState, useEffect } from 'react';
import '../styles/NavBar.css';

function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTransparent, setIsTransparent] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setIsTransparent(window.scrollY < 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={`navbar ${isTransparent ? 'transparent' : ''}`}>
                <div className="nav-logo">
                    <a href="#home">HITRECORD</a>
                </div>
                <div className="nav-links">
                    <a href="#about">About</a>
                    <a href="#projects">Projects</a>
                    <a href="#contact">Contact</a>
                </div>
                <button
                    className={`menu-btn ${isMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <i className="fas fa-bars"></i>
                </button>
            </nav>
            <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
                <a href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</a>
                <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
            </div>
        </>
    );
}

export default NavBar;
