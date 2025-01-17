import '../styles/Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>About Me</h3>
                    <p>A passionate developer focused on creating engaging web experiences and learning new technologies.</p>
                    <div className="social-links">
                        <a href="https://github.com/H1tRecord" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-github"></i>
                            <span>GitHub</span>
                        </a>
                        <a href="https://twitter.com/HitRedcord" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter"></i>
                            <span>Twitter</span>
                        </a>
                        <a href="https://www.youtube.com/@hitrecordyt" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-youtube"></i>
                            <span>YouTube</span>
                        </a>
                    </div>
                </div>

                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul className="quick-links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#projects">Projects</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Contact</h3>
                    <p>Feel free to reach out for collaborations or just a friendly chat</p>
                    <div className="social-links">
                        <a href="mailto:kjainfotech@gmail.com">
                            <i className="fas fa-envelope"></i>
                            <span>Email</span>
                        </a>
                        <a href="https://ko-fi.com/hitrecord" target="_blank" rel="noopener noreferrer">
                            <i className="fa-solid fa-circle-dollar-to-slot"></i>
                            <span>Support</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="copyright">
                    &copy; {currentYear} HitRecord. Built with <i className="fas fa-heart" style={{ color: '#ff4545' }}></i> and lots of ☕
                </p>
            </div>
        </footer>
    );
}

export default Footer;
