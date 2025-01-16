import '../styles/Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="social-links">
                <a href="https://github.com/H1tRecord" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github"></i>
                </a>
                <a href="mailto:kjainfotech@gmail.com">
                    <i className="fas fa-envelope"></i>
                </a>
            </div>
            <div className="copyright">
                <p>&copy; {currentYear} HitRecord. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
