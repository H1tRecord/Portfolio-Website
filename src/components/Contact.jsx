import { useState } from 'react';
import '../styles/Contact.css';

function Contact() {
    const [formStatus, setFormStatus] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showRecaptcha, setShowRecaptcha] = useState(false);
    const [submissionCount, setSubmissionCount] = useState(0);
    const [lastSubmissionTime, setLastSubmissionTime] = useState(0);

    const SUBMISSION_LIMIT = 3;
    const TIME_WINDOW = 5 * 60 * 1000; // 5 minutes

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentTime = Date.now();

        if (currentTime - lastSubmissionTime < TIME_WINDOW) {
            setSubmissionCount(prev => prev + 1);
        } else {
            setSubmissionCount(1);
        }
        setLastSubmissionTime(currentTime);

        if (submissionCount >= SUBMISSION_LIMIT) {
            setShowRecaptcha(true);
            return;
        }

        await submitForm(e.target);
    };

    const submitForm = async (form) => {
        setIsLoading(true);
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                setFormStatus({
                    message: 'Message sent successfully! I\'ll get back to you soon.',
                    type: 'success'
                });
                form.reset();
                setShowRecaptcha(false);
                setSubmissionCount(0);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            setFormStatus({
                message: error.message || 'An unexpected error occurred. Please try again.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
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

                <form
                    action="https://formspree.io/f/mdkkbdza"
                    method="POST"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <input type="text" name="name" required placeholder="Your Name" />
                    </div>
                    <div className="form-group">
                        <input type="email" name="email" required placeholder="Your Email" />
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
                        className={`submit-btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        <span className="btn-text">Send Message</span>
                        {isLoading && <span className="btn-spinner" />}
                    </button>
                </form>
            </div>

            {showRecaptcha && (
                <div className="modal active">
                    <div className="modal-content">
                        <h3>Please Verify You're Human</h3>
                        <p>For security purposes, please complete the verification below.</p>
                        <div className="g-recaptcha-container"></div>
                        <button
                            type="button"
                            className="modal-close"
                            onClick={() => setShowRecaptcha(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Contact;