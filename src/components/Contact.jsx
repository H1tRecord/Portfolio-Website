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
            <h2>Get In Touch</h2>
            <p className="section-caption">Have a question or want to work together?</p>

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