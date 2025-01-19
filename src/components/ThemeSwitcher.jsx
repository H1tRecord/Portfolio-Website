import { useState, useEffect } from 'react';
import '../styles/ThemeSwitcher.css';
import flashVideo from '../assets/flash.mp4';

const THEMES = [
    { id: 'dark', name: 'Dark', icon: '🌙' },
    { id: 'light', name: 'Light', icon: '☀️' },
    { id: 'cherry', name: 'Cherry Blossom', icon: '🌸' },
    { id: 'ocean', name: 'Ocean Drift', icon: '🌊' },
    { id: 'amber', name: 'Amber Sunset', icon: '🌅' }
];

function ThemeSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('dark');
    const [warningCount, setWarningCount] = useState(0);
    const [showVideo, setShowVideo] = useState(false);
    const [loading, setLoading] = useState(true);
    const [videoReady, setVideoReady] = useState(false);

    const warningMessages = [
        {
            title: "Wait! Are you sure?",
            message: "Light mode might hurt your eyes! 👀"
        },
        {
            title: "Last Chance!",
            message: "9 out of 10 developers prefer dark mode. Don't be that one... 🤓"
        },
        {
            title: "FINAL WARNING ⚠️",
            message: "You've been warned! Preparing your eyes for permanent damage..."
        },
        {
            title: "Are you Sure???",
            message: "I don't like light mode... 😢",
            disclaimer: "Disclaimer: There will be loud sounds."
        }
    ];

    useEffect(() => {
        // Load theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setCurrentTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Preload video
        const preloadVideo = document.getElementById('preload-flash-video');
        if (preloadVideo) {
            preloadVideo.load();
            preloadVideo.oncanplaythrough = () => {
                setVideoReady(true);
                setLoading(false);
            };
        }
    }, []);

    const handleLightModeAttempt = () => {
        if (warningCount < 4) {
            setWarningCount(prev => prev + 1);
        } else {
            setShowVideo(true);
            const video = document.getElementById('flash-video');
            if (video) {
                video.currentTime = 0;
                video.play().catch(err => console.log('Video playback failed:', err));
            }
            setTimeout(() => {
                setShowVideo(false);
                handleThemeChange('light', true);
                setWarningCount(0);
            }, 5000);
        }
    };

    const handleThemeChange = (themeId, bypassWarning = false) => {
        if (themeId === 'light' && currentTheme !== 'light' && !bypassWarning) {
            handleLightModeAttempt();
            return;
        }

        setCurrentTheme(themeId);
        document.documentElement.setAttribute('data-theme', themeId);
        localStorage.setItem('theme', themeId);
        setIsOpen(false);
    };

    const handleVideoLoad = () => {
        setLoading(false);
    };

    return (
        <>
            <video
                id="preload-flash-video"
                src={flashVideo}
                style={{ display: 'none' }}
                preload="auto"
            />

            <div className="theme-switcher">
                <button
                    className="theme-btn"
                    onClick={() => setIsOpen(!isOpen)}
                    title="Change Theme"
                >
                    <i className="fas fa-palette"></i>
                </button>

                <div className={`theme-modal ${isOpen ? 'active' : ''}`}>
                    <div className="theme-options">
                        {THEMES.map(theme => (
                            <div
                                key={theme.id}
                                className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                                onClick={() => handleThemeChange(theme.id)}
                            >
                                <span>{theme.icon}</span>
                                {theme.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {warningCount > 0 && warningCount < 5 && (
                <div className="warning-modal">
                    <div className="warning-content">
                        <h2>{warningMessages[warningCount - 1].title}</h2>
                        <p>{warningMessages[warningCount - 1].message}</p>
                        {warningCount === 4 && (
                            <p className="disclaimer">{warningMessages[3].disclaimer}</p>
                        )}
                        <div className="warning-buttons">
                            <button onClick={() => setWarningCount(0)}>
                                Return to Safety
                            </button>
                            <button onClick={handleLightModeAttempt}>
                                I'm Stubborn, Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showVideo && videoReady && (
                <div className="fullscreen-video">
                    <video
                        id="flash-video"
                        autoPlay
                        playsInline
                        src={flashVideo}
                        style={{
                            width: '100vw',
                            height: '100vh',
                            objectFit: 'cover',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            zIndex: 9999
                        }}
                    />
                </div>
            )}
        </>
    );
}

export default ThemeSwitcher;