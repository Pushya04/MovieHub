import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TermsPage.module.css';

const TermsPage = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Terms of Service</h1>
          <p className={styles.heroSubtitle}>
            Please read these terms carefully before using our movie discovery platform. 
            By using our service, you agree to be bound by these terms.
          </p>
          <p className={styles.lastUpdated}>Last updated: May 05, 2024</p>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Back Button */}
        <Link to="/" className={styles.backButton}>
          ← Back to Home
        </Link>

        {/* Legal Content */}
        <div className={styles.legalContent}>
          <section className={styles.section}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using MovieHub ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Description of Service</h2>
            <p>
              MovieHub is a movie discovery platform that provides users with movie information, reviews, recommendations, and the ability to 
              create watchlists and share opinions about films. Our service includes:
            </p>
            <ul>
              <li>Movie database and information</li>
              <li>User reviews and ratings</li>
              <li>Personalized recommendations</li>
              <li>Watchlist management</li>
              <li>Community features</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. User Accounts</h2>
            <p>
              To access certain features of the Service, you may be required to create an account. You are responsible for:
            </p>
            <ul>
              <li>Maintaining the confidentiality of your account information</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring your account information is accurate and up-to-date</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. User Conduct</h2>
            <p>
              You agree not to use the Service to:
            </p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Post false, misleading, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the Service</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Content and Intellectual Property</h2>
            <p>
              The Service contains content owned by MovieHub and third parties. You retain ownership of content you create, but grant us a 
              license to use, display, and distribute your content in connection with the Service.
            </p>
            <p>
              Movie information, including titles, descriptions, and metadata, is provided by third-party sources and is subject to their 
              respective terms and conditions.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Please review our <Link to="/privacy" className={styles.link}>Privacy Policy</Link>, which also 
              governs your use of the Service, to understand our practices regarding the collection and use of your personal information.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service at any time, with or without cause, with or without notice. 
              You may also terminate your account at any time by contacting our support team.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Disclaimers</h2>
            <p>
              The Service is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or usefulness 
              of any information on the Service. Your use of the Service is at your own risk.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Limitation of Liability</h2>
            <p>
              In no event shall MovieHub be liable for any indirect, incidental, special, consequential, or punitive damages, including 
              without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms 
              on this page. Your continued use of the Service after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which MovieHub operates, 
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className={styles.contactInfo}>
              <p><strong>Email:</strong> moviehubflix01@gmail.com</p>
              <p><strong>Address:</strong> IIIT Guwahati, Bongora 781015, Assam, India</p>
              <p><strong>Phone:</strong> +91 9347967884</p>
              <p><strong>Data Protection Officer:</strong> pyaraka.pushyamithra22b@iiitg.ac.in</p>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.legalLinks}>
            <h3>Legal Documents</h3>
            <ul>
              <li><Link to="/terms" className={`${styles.legalLink} ${styles.active}`}>Terms of Service</Link></li>
              <li><Link to="/privacy" className={styles.legalLink}>Privacy Policy</Link></li>
              <li><Link to="/cookies" className={styles.legalLink}>Cookie Policy</Link></li>
            </ul>
          </div>

          <div className={styles.helpSection}>
            <h3>Need Help?</h3>
            <p>
              Have questions about our terms or policies? Our support team is here to help.
            </p>
            <Link to="/contact" className={styles.helpButton}>
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
