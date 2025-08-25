import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CookiesPage.module.css';

const CookiesPage = () => {
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backButton}>
        ← Back to Home
      </Link>
      
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Cookie Policy</h1>
          <p className={styles.heroSubtitle}>
            How we use cookies and similar technologies to enhance your experience
          </p>
          <p className={styles.lastUpdated}>
            Last updated: May 05, 2024
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.legalContent}>
          <section className={styles.section}>
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit a website. 
              They help websites remember information about your visit, such as your preferred language 
              and other settings, which can make your next visit easier and more useful.
            </p>
            <p>
              At MovieHub, we use cookies and similar technologies to provide you with a better, 
              more personalized experience and to help us improve our service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Types of Cookies We Use</h2>
            
            <h3>2.1 Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They enable basic functions 
              like page navigation, access to secure areas, and user authentication. The website cannot function 
              properly without these cookies.
            </p>
            <ul>
              <li><strong>Authentication cookies:</strong> Remember your login status and session information</li>
              <li><strong>Security cookies:</strong> Help protect against fraud and maintain security</li>
              <li><strong>Functionality cookies:</strong> Enable core website features</li>
            </ul>

            <h3>2.2 Performance and Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with our website by collecting 
              and reporting information anonymously. This helps us improve our service and user experience.
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> Track website usage and performance metrics</li>
              <li><strong>Performance monitoring:</strong> Monitor page load times and errors</li>
              <li><strong>User behavior analysis:</strong> Understand how users navigate our site</li>
            </ul>

            <h3>2.3 Functional Cookies</h3>
            <p>
              These cookies enable enhanced functionality and personalization. They may be set by us 
              or by third-party providers whose services we have added to our pages.
            </p>
            <ul>
              <li><strong>Preference cookies:</strong> Remember your language, region, and display preferences</li>
              <li><strong>Personalization cookies:</strong> Store your movie preferences and watchlist</li>
              <li><strong>Social media cookies:</strong> Enable social media sharing and integration</li>
            </ul>

            <h3>2.4 Marketing and Advertising Cookies</h3>
            <p>
              These cookies are used to track visitors across websites to display relevant and 
              engaging advertisements. They may also be used to limit the number of times you see an ad.
            </p>
            <ul>
              <li><strong>Advertising cookies:</strong> Deliver targeted advertisements</li>
              <li><strong>Social media cookies:</strong> Enable social media platform integration</li>
              <li><strong>Retargeting cookies:</strong> Show relevant ads based on your interests</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Third-Party Cookies</h2>
            <p>
              We may use third-party services that place cookies on your device. These services help us:
            </p>
            <ul>
              <li>Analyze website traffic and user behavior</li>
              <li>Provide social media integration</li>
              <li>Deliver relevant advertisements</li>
              <li>Improve website performance and security</li>
            </ul>
            <p>
              Third-party cookies are subject to the privacy policies of the respective third-party providers. 
              We recommend reviewing their policies for more information.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. How Long Cookies Are Stored</h2>
            <p>Cookies have different lifespans:</p>
            
            <h3>4.1 Session Cookies</h3>
            <p>
              These cookies are temporary and are deleted when you close your browser. 
              They are used to maintain your session and preferences during your visit.
            </p>

            <h3>4.2 Persistent Cookies</h3>
            <p>
              These cookies remain on your device for a set period or until you delete them. 
              They help us remember your preferences and provide a personalized experience.
            </p>

            <h3>4.3 Cookie Lifespan</h3>
            <ul>
              <li><strong>Essential cookies:</strong> Up to 1 year</li>
              <li><strong>Analytics cookies:</strong> Up to 2 years</li>
              <li><strong>Functional cookies:</strong> Up to 1 year</li>
              <li><strong>Marketing cookies:</strong> Up to 1 year</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Managing Your Cookie Preferences</h2>
            <p>
              You have several options for managing cookies and similar technologies:
            </p>

            <h3>5.1 Browser Settings</h3>
            <p>
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul>
              <li>View and delete existing cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Block all cookies</li>
              <li>Set preferences for different types of cookies</li>
            </ul>

            <h3>5.2 Cookie Consent</h3>
            <p>
              When you first visit MovieHub, you'll see a cookie consent banner. You can:
            </p>
            <ul>
              <li>Accept all cookies</li>
              <li>Customize your cookie preferences</li>
              <li>Reject non-essential cookies</li>
            </ul>

            <h3>5.3 Third-Party Opt-Outs</h3>
            <p>
              For third-party cookies, you can opt out through the respective service providers:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className={styles.externalLink}>Google Analytics Opt-out</a></li>
              <li><strong>Advertising networks:</strong> Various opt-out mechanisms available</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Impact of Disabling Cookies</h2>
            <p>
              While you can disable cookies, please note that doing so may affect your experience:
            </p>
            <ul>
              <li>Some features may not work properly</li>
              <li>You may need to re-enter information more frequently</li>
              <li>Personalization features may be limited</li>
              <li>Website performance may be affected</li>
            </ul>
            <p>
              Essential cookies are required for basic functionality and cannot be disabled.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons. We will notify you of any material 
              changes through our website or other communication channels.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
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
              <li><Link to="/privacy" className={styles.legalLink}>Privacy Policy</Link></li>
              <li><Link to="/cookies" className={`${styles.legalLink} ${styles.active}`}>Cookie Policy</Link></li>
              <li><Link to="/terms" className={styles.legalLink}>Terms of Service</Link></li>
            </ul>
          </div>

          <div className={styles.helpSection}>
            <h3>Cookie Questions?</h3>
            <p>If you have questions about cookies or tracking, we're here to help.</p>
            <Link to="/contact" className={styles.helpButton}>Contact Us</Link>
          </div>

          <div className={styles.cookieSettings}>
            <h3>Cookie Settings</h3>
            <p>Manage your cookie preferences and settings.</p>
            <button className={styles.settingsButton}>Manage Cookies</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
