import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PrivacyPage.module.css';

const PrivacyPage = () => {
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backButton}>
        ← Back to Home
      </Link>
      
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.heroSubtitle}>
            How we collect, use, and protect your personal information
          </p>
          <p className={styles.lastUpdated}>
            Last updated: May 05, 2024
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.legalContent}>
          <section className={styles.section}>
            <h2>1. Introduction</h2>
            <p>
              At MovieHub, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
            <p>
              By using MovieHub, you consent to the data practices described in this policy. 
              If you do not agree with our policies and practices, please do not use our service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We may collect the following personal information:</p>
            <ul>
              <li>Name and email address when you create an account</li>
              <li>Profile information (username, bio, preferences)</li>
              <li>Movie ratings, reviews, and watchlist data</li>
              <li>Communication preferences and settings</li>
            </ul>

            <h3>2.2 Usage Information</h3>
            <p>We automatically collect certain information about your use of the service:</p>
            <ul>
              <li>Pages visited and features used</li>
              <li>Search queries and filters applied</li>
              <li>Time spent on different sections</li>
              <li>Device information and browser type</li>
              <li>IP address and general location data</li>
            </ul>

            <h3>2.3 Cookies and Tracking Technologies</h3>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
              and provide personalized content. For more details, see our 
              <Link to="/cookies" className={styles.link}> Cookie Policy</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li>Provide and maintain our movie discovery service</li>
              <li>Personalize your experience and recommendations</li>
              <li>Process your reviews, ratings, and watchlist</li>
              <li>Communicate with you about service updates</li>
              <li>Improve our platform and develop new features</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Information Sharing and Disclosure</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
            
            <h3>4.1 Public Content</h3>
            <p>
              Your movie reviews, ratings, and public profile information are visible to other users 
              and may be displayed publicly on the platform.
            </p>

            <h3>4.2 Service Providers</h3>
            <p>
              We may share information with trusted third-party service providers who assist us in:
            </p>
            <ul>
              <li>Hosting and maintaining our platform</li>
              <li>Analyzing usage data and improving services</li>
              <li>Processing payments (if applicable)</li>
              <li>Providing customer support</li>
            </ul>

            <h3>4.3 Legal Requirements</h3>
            <p>
              We may disclose your information if required by law, court order, or government request, 
              or to protect our rights, property, or safety.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against:
            </p>
            <ul>
              <li>Unauthorized access or disclosure</li>
              <li>Data loss or destruction</li>
              <li>Alteration or corruption</li>
            </ul>
            <p>
              However, no method of transmission over the internet or electronic storage is 100% secure. 
              While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services 
              and fulfill the purposes outlined in this policy. We may retain certain information for:
            </p>
            <ul>
              <li>Account management and service provision</li>
              <li>Legal compliance and record-keeping</li>
              <li>Analytics and service improvement</li>
            </ul>
            <p>
              You may request deletion of your account and associated data at any time.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Your Rights and Choices</h2>
            <p>You have the following rights regarding your personal information:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request removal of your personal data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
              <li><strong>Withdrawal:</strong> Withdraw consent where applicable</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If you are a parent or guardian and believe 
              your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. 
              We ensure that such transfers comply with applicable data protection laws and implement 
              appropriate safeguards to protect your information.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes 
              through the service or via email. Your continued use of MovieHub after changes become effective 
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className={styles.contactInfo}>
              <p><strong>Email:</strong> moviehubflix01@gmail.com</p>
              <p><strong>Address:</strong> IIIT Guwahati, Bongora 781015, Assam, India</p>
              <p><strong>Phone:</strong> +91 9347967884</p>
              <p><strong>Data Protection Officer:</strong> pyaraka.pushyamithra22b@iiitg.ac.in</p>
            </div>
          </section>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.legalLinks}>
            <h3>Legal Documents</h3>
            <ul>
              <li><Link to="/privacy" className={`${styles.legalLink} ${styles.active}`}>Privacy Policy</Link></li>
              <li><Link to="/cookies" className={styles.legalLink}>Cookie Policy</Link></li>
              <li><Link to="/terms" className={styles.legalLink}>Terms of Service</Link></li>
            </ul>
          </div>

          <div className={styles.helpSection}>
            <h3>Privacy Concerns?</h3>
            <p>If you have questions about your privacy or data, we're here to help.</p>
            <Link to="/contact" className={styles.helpButton}>Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
