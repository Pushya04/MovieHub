import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import moviehubLogo from '../../../assets/images/moviehub-logo.png';
import facebookLogo from '../../../assets/images/facebook-logo.png';
import instagramLogo from '../../../assets/images/instagram-logo.png';
import twitterLogo from '../../../assets/images/twitter-logo.png';

const Footer = () => {
  const footerLinks = [
    {
      title: 'About Us',
      links: [
        { path: '/our-story', text: 'Our Story' },
        { path: '/careers', text: 'Careers' },
        { path: '/contact', text: 'Contact' },
      ]
    },
    {
      title: 'Quick Links',
      links: [
        { path: '/faq', text: 'FAQ' },
        { path: '/support', text: 'Support' },
        { path: '/blog', text: 'Blog' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { path: '/terms', text: 'Terms of Service' },
        { path: '/privacy', text: 'Privacy Policy' },
        { path: '/cookies', text: 'Cookie Policy' },
      ]
    }
  ];
  
  return (
    <footer className={styles.footer} data-testid="footer">
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <Link to="/" className={styles.logo}>
              <img
                src={moviehubLogo}
                alt="Movie Hub Logo"
                width="140"
                height="45"
              />
            </Link>
            <p className={styles.description}>
              Your ultimate destination for movie lovers. Discover, watch, and enjoy.
            </p>
          </div>
          
          {/* Footer Links */}
          <div className={styles.links}>
            {footerLinks.map((section) => (
              <div key={section.title} className={styles.column}>
                <h4 className={styles.heading}>{section.title}</h4>
                <ul className={styles.list}>
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path} className={styles.link}>
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Social Media */}
        <div className={styles.social}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <img src={facebookLogo} alt="Facebook" width="24" height="24" />
          </a>
          <a href="https://instagram.com/moviehubflix01" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <img src={instagramLogo} alt="Instagram" width="24" height="24" />
          </a>
          <a href="https://www.linkedin.com/in/pushya04/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <img src={twitterLogo} alt="LinkedIn" width="24" height="24" />
          </a>
        </div>
        
        {/* Copyright */}
        <div className={styles.copyright}>
          © {new Date().getFullYear()} Movie Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;