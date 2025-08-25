import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ContactPage.module.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Get in Touch</h1>
          <p className={styles.heroSubtitle}>
            Have a question, suggestion, or just want to say hello? We'd love to hear from you! 
            Our team is here to help and always excited to connect with movie enthusiasts.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Back Button */}
        <Link to="/" className={styles.backButton}>
          ← Back to Home
        </Link>

        {/* Contact Form */}
        <div className={styles.contactForm}>
          <h2>Send us a Message</h2>
          
          {submitStatus === 'success' && (
            <div className={styles.successMessage}>
              Thank you for your message! We'll get back to you within 24 hours.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className={styles.errorMessage}>
              Something went wrong. Please try again or contact us directly.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Your full name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject">Subject *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Feedback & Suggestions</option>
                <option value="partnership">Partnership Opportunities</option>
                <option value="careers">Careers & Job Inquiries</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Tell us how we can help you..."
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending Message...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className={styles.contactInfo}>
          <div className={styles.contactMethods}>
            <div className={styles.contactMethod}>
              <h3>Email</h3>
              <p><a href="mailto:moviehubflix01@gmail.com">moviehubflix01@gmail.com</a></p>
              <p>We typically respond within 2-4 hours during business hours.</p>
            </div>
            
            <div className={styles.contactMethod}>
              <h3>Phone</h3>
              <p><a href="tel:+919347967884">+91 9347967884</a></p>
              <p>Available during business hours: 9 AM - 6 PM IST</p>
            </div>
            
            <div className={styles.contactMethod}>
              <h3>Social Media</h3>
              <p>Twitter: <a href="https://twitter.com/moviehubflix01" target="_blank" rel="noopener noreferrer">@moviehubflix01</a></p>
              <p>Instagram: <a href="https://instagram.com/moviehubflix01" target="_blank" rel="noopener noreferrer">@moviehubflix01</a></p>
              <p>LinkedIn: <a href="https://www.linkedin.com/in/pushya04/" target="_blank" rel="noopener noreferrer">@pushya04</a></p>
            </div>
            
            <div className={styles.contactMethod}>
              <h3>Office Address</h3>
              <p>IIIT Guwahati</p>
              <p>Bongora 781015</p>
              <p>Assam, India</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className={styles.faq}>
            <h3>Frequently Asked Questions</h3>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>How quickly do you respond to messages?</div>
              <div className={styles.faqAnswer}>
                We typically respond to all inquiries within 24 hours during business days.
              </div>
            </div>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>Can I report a bug or technical issue?</div>
              <div className={styles.faqAnswer}>
                Absolutely! Please use the "Technical Support" subject when submitting your message.
              </div>
            </div>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>Do you offer API access for developers?</div>
              <div className={styles.faqAnswer}>
                Yes! Contact us with "Partnership Opportunities" to learn about our API program.
              </div>
            </div>
          </div>

          {/* Response Time Information */}
          <div className={styles.responseTime}>
            <h3>Our Response Times</h3>
            <p>📧 Email: Within 24 hours</p>
            <p>💬 Live Chat: Immediate response during business hours</p>
            <p>📞 Phone: Available for urgent matters by appointment</p>
            <p>🌍 We serve users worldwide and respond in multiple languages</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
