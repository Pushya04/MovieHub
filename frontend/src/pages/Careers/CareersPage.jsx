import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CareersPage.module.css';

const CareersPage = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Join Our Team</h1>
          <p className={styles.heroSubtitle}>
            Be part of a passionate team that's revolutionizing how people discover and experience movies. 
            We're looking for talented individuals who share our vision and drive for innovation.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Back Button */}
        <Link to="/" className={styles.backButton}>
          ← Back to Home
        </Link>

        {/* Stats Section */}
        <section className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>50+</div>
            <div className={styles.statLabel}>Team Members</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>15+</div>
            <div className={styles.statLabel}>Countries</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>4.8</div>
            <div className={styles.statLabel}>Employee Rating</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>95%</div>
            <div className={styles.statLabel}>Retention Rate</div>
          </div>
        </section>

        {/* Mission Section */}
        <section className={styles.mission}>
          <h2>Our Mission</h2>
          <p>
            We're on a mission to create the world's most comprehensive and user-friendly movie discovery platform. 
            Our team works tirelessly to build innovative features that help movie enthusiasts find their next favorite film, 
            connect with like-minded fans, and build meaningful relationships through shared cinematic experiences.
          </p>
        </section>

        {/* Values Section */}
        <section className={styles.values}>
          <h2>Our Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🎯</div>
              <h3>Innovation First</h3>
              <p>We constantly push boundaries and explore new technologies to deliver exceptional user experiences.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🤝</div>
              <h3>Collaboration</h3>
              <p>We believe in the power of teamwork and diverse perspectives to solve complex challenges.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>💡</div>
              <h3>User-Centric</h3>
              <p>Every decision we make is driven by what's best for our users and their movie discovery journey.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🚀</div>
              <h3>Growth Mindset</h3>
              <p>We encourage continuous learning and personal development for all team members.</p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className={styles.benefits}>
          <h2>Why Work With Us?</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🏠</div>
              <h3>Remote First</h3>
              <p>Work from anywhere in the world with our flexible remote work policy.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>💰</div>
              <h3>Competitive Salary</h3>
              <p>We offer industry-leading compensation packages and equity options.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>📚</div>
              <h3>Learning Budget</h3>
              <p>Annual budget for courses, conferences, and professional development.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🏖️</div>
              <h3>Unlimited PTO</h3>
              <p>Take time off when you need it with our unlimited vacation policy.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🏥</div>
              <h3>Health Benefits</h3>
              <p>Comprehensive health, dental, and vision coverage for you and your family.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🎬</div>
              <h3>Movie Perks</h3>
              <p>Free movie tickets, streaming subscriptions, and exclusive industry events.</p>
            </div>
          </div>
        </section>

        {/* Job Openings Section */}
        <section className={styles.jobOpenings}>
          <h2>Open Positions</h2>
          <div className={styles.jobGrid}>
            <div className={styles.jobCard}>
              <h3>Senior Frontend Developer</h3>
              <div className={styles.jobLocation}>Remote • Full-time</div>
              <p className={styles.jobDescription}>
                Join our frontend team to build beautiful, responsive user interfaces using React and modern web technologies.
              </p>
              <div className={styles.jobTags}>
                <span className={styles.jobTag}>React</span>
                <span className={styles.jobTag}>TypeScript</span>
                <span className={styles.jobTag}>CSS</span>
              </div>
              <Link to="/contact" className={styles.applyButton}>Apply Now</Link>
            </div>

            <div className={styles.jobCard}>
              <h3>Backend Engineer</h3>
              <div className={styles.jobLocation}>Remote • Full-time</div>
              <p className={styles.jobDescription}>
                Build scalable backend services and APIs using Python, FastAPI, and cloud technologies.
              </p>
              <div className={styles.jobTags}>
                <span className={styles.jobTag}>Python</span>
                <span className={styles.jobTag}>FastAPI</span>
                <span className={styles.jobTag}>PostgreSQL</span>
              </div>
              <Link to="/contact" className={styles.applyButton}>Apply Now</Link>
            </div>

            <div className={styles.jobCard}>
              <h3>Product Manager</h3>
              <div className={styles.jobLocation}>Remote • Full-time</div>
              <p className={styles.jobDescription}>
                Lead product strategy and development for our movie discovery platform.
              </p>
              <div className={styles.jobTags}>
                <span className={styles.jobTag}>Product Strategy</span>
                <span className={styles.jobTag}>User Research</span>
                <span className={styles.jobTag}>Agile</span>
              </div>
              <Link to="/contact" className={styles.applyButton}>Apply Now</Link>
            </div>

            <div className={styles.jobCard}>
              <h3>UX/UI Designer</h3>
              <div className={styles.jobLocation}>Remote • Full-time</div>
              <p className={styles.jobDescription}>
                Create intuitive and engaging user experiences for our movie platform.
              </p>
              <div className={styles.jobTags}>
                <span className={styles.jobTag}>Figma</span>
                <span className={styles.jobTag}>User Research</span>
                <span className={styles.jobTag}>Prototyping</span>
              </div>
              <Link to="/contact" className={styles.applyButton}>Apply Now</Link>
            </div>

            <div className={styles.jobCard}>
              <h3>Data Scientist</h3>
              <div className={styles.jobLocation}>Remote • Full-time</div>
              <p className={styles.jobDescription}>
                Develop machine learning models for movie recommendations and user insights.
              </p>
              <div className={styles.jobTags}>
                <span className={styles.jobTag}>Python</span>
                <span className={styles.jobTag}>ML</span>
                <span className={styles.jobTag}>Data Analysis</span>
              </div>
              <Link to="/contact" className={styles.applyButton}>Apply Now</Link>
            </div>

            <div className={styles.jobCard}>
              <h3>DevOps Engineer</h3>
              <div className={styles.jobLocation}>Remote • Full-time</div>
              <p className={styles.jobDescription}>
                Build and maintain our cloud infrastructure and deployment pipelines.
              </p>
              <div className={styles.jobTags}>
                <span className={styles.jobTag}>AWS</span>
                <span className={styles.jobTag}>Docker</span>
                <span className={styles.jobTag}>CI/CD</span>
              </div>
              <Link to="/contact" className={styles.applyButton}>Apply Now</Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <h2>Don't See Your Role?</h2>
          <p>
            We're always looking for talented individuals to join our team. 
            Even if you don't see a specific position listed, we'd love to hear from you!
          </p>
          <Link to="/contact" className={styles.ctaButton}>
            Send Us Your Resume
          </Link>
        </section>

        {/* Contact Section */}
        <div className={styles.contactSection}>
          <h3>Get in Touch</h3>
          <p>Ready to join our team? We'd love to hear from you!</p>
          <div className={styles.contactInfo}>
            <p><strong>Email:</strong> <a href="mailto:moviehubflix01@gmail.com">moviehubflix01@gmail.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+919347967884">+91 9347967884</a></p>
            <p><strong>Business Hours:</strong> 9 AM - 6 PM IST</p>
            <p><strong>Office:</strong> IIIT Guwahati, Bongora 781015, Assam, India</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
