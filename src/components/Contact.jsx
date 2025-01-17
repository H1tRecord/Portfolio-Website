import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/Contact.css';

function Contact() {
    const [formStatus, setFormStatus] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const form = useRef();

    useEffect(() => {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.contact h2, .contact-container, .contact-info h3, .contact-info p, .contact-reasons li, .form-group, .submit-btn');

        animatedElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await emailjs.sendForm(
                'service_nkon5ks',
                'template_kfx8l27',
                form.current,
                'R3uZwgNsoClr2lEeu'
            );

            setFormStatus({
                message: 'Message sent successfully! I\'ll get back to you soon.',
                type: 'success'
            });
            form.current.reset();
        } catch (error) {
            setFormStatus({
                message: 'Failed to send message. Please try again.',
                type: 'error'
            });
            console.error('Email sending failed:', error);
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setFormStatus({ message: '', type: '' });
            }, 5000);
        }
    };

    return (
        <section id="contact" className="contact">
            <div className="contact-waves-top">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="shape-fill"></path>
                </svg>
            </div>

            <h2>Get In Touch</h2>

            <div className="contact-container">
                <div className="contact-info">
                    <h3>Let's Create Something Together</h3>
                    <p>
                        I'm always excited to connect with fellow developers, potential clients,
                        and anyone interested in web development. Whether you have a project in mind
                        or just want to say hello, I'd love to hear from you!
                    </p>
                    <ul className="contact-reasons">
                        <li>
                            <i className="fas fa-handshake"></i>
                            <span>Project Collaborations</span>
                        </li>
                        <li>
                            <i className="fas fa-code"></i>
                            <span>Custom Development Work</span>
                        </li>
                        <li>
                            <i className="fas fa-question-circle"></i>
                            <span>Technical Questions</span>
                        </li>
                        <li>
                            <i className="fas fa-lightbulb"></i>
                            <span>Development Advice</span>
                        </li>
                        <li>
                            <i className="fas fa-comments"></i>
                            <span>General Inquiries</span>
                        </li>
                    </ul>
                </div>

                <form ref={form} onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="text" name="user_name" required placeholder="Your Name" />
                    </div>
                    <div className="form-group">
                        <input type="email" name="user_email" required placeholder="Your Email" />
                    </div>
                    <div className="form-group">
                        <textarea name="message" required placeholder="Your Message" rows="5" />
                    </div>

                    {formStatus.message && (
                        <div className={`form-status ${formStatus.type}`}>
                            {formStatus.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="btn-text">Sending...</span>
                                <span className="btn-spinner" />
                            </>
                        ) : (
                            <span className="btn-text">Send Message</span>
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default Contact;