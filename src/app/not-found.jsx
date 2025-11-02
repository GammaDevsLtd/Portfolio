import React from 'react';
import Link from 'next/link';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Error Code */}
        <div className={styles.errorCode}>
          <span className={styles.number}>4</span>
          <span className={styles.zero}>
            <div className={styles.zeroInner}></div>
          </span>
          <span className={styles.number}>4</span>
        </div>

        {/* Error Message */}
        <div className={styles.errorMessage}>
          <h1 className={styles.title}>Page Not Found</h1>
          <p className={styles.description}>
            Oops! The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even the best developers encounter missing pages sometimes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            Return Home
          </Link>
          <Link href="/projects" className={styles.secondaryButton}>
            Explore Projects
          </Link>
        </div>

        {/* Additional Info */}
        <div className={styles.additionalInfo}>
          <p>While you're here, why not:</p>
          <ul className={styles.suggestions}>
            <li>Check out our amazing <Link href="/projects">projects</Link></li>
            <li>Learn more <Link href="/about">about us</Link></li>
            <li>Get in <Link href="/contact">touch</Link> with our team</li>
          </ul>
        </div>
      </div>

      {/* Footer Note */}
      <div className={styles.footerNote}>
        <p>If you believe this is an error, please <Link href="/contact">contact our support team</Link></p>
      </div>
    </div>
  );
}