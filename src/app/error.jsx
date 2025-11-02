'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Error.module.css';
import { 
  FiAlertTriangle, 
  FiRefreshCw, 
  FiHome, 
  FiMail, 
  FiWifi, 
  FiChrome,
  FiTrash2,
  FiClock,
  FiCode
} from 'react-icons/fi';
import { 
  FaExclamationTriangle,
  FaRedo,
  FaHome,
  FaEnvelope,
  FaWifi,
  FaChrome,
  FaBroom,
  FaClock,
  FaCode
} from 'react-icons/fa';

export default function Error({ error, reset }) {
  const [errorDetails, setErrorDetails] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Log the error to an error reporting service
    console.error('Error occurred:', error);
    
    // Extract error details
    const details = {
      message: error?.message || 'An unexpected error occurred',
      name: error?.name || 'Error',
      stack: error?.stack,
      componentStack: error?.componentStack,
      digest: error?.digest,
      timestamp: new Date().toLocaleString(),
      errorId: `ERR_${Date.now()}`,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
    };
    
    setErrorDetails(details);
  }, [error]);

  const handleTryAgain = () => {
    reset();
  };

  const handleClearCache = () => {
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    localStorage.clear();
    sessionStorage.clear();
    reset();
  };

  if (!isClient) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading error details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
        <div className={styles.pulse}></div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Error Icon */}
        <div className={styles.errorIcon}>
          <div className={styles.iconWrapper}>
            <FaExclamationTriangle className={styles.errorIconSvg} />
          </div>
        </div>

        {/* Error Message */}
        <div className={styles.errorMessage}>
          <h1 className={styles.title}>Something Went Wrong</h1>
          <p className={styles.description}>
            We apologize for the inconvenience. It seems we've encountered an unexpected error. 
            Our technical team has been notified and is working to resolve the issue.
          </p>
          
          {/* Detailed Error Information */}
          <div className={styles.errorDetails}>
            <div className={styles.errorHeader}>
              <FiAlertTriangle className={styles.errorHeaderIcon} />
              <span>Error Details</span>
            </div>
            <div className={styles.errorInfo}>
              <div className={styles.errorItem}>
                <strong>Message:</strong>
                <span className={styles.errorValue}>{errorDetails?.message}</span>
              </div>
              <div className={styles.errorItem}>
                <strong>Type:</strong>
                <span className={styles.errorValue}>{errorDetails?.name}</span>
              </div>
              {errorDetails?.digest && (
                <div className={styles.errorItem}>
                  <strong>Error ID:</strong>
                  <span className={styles.errorValue}>{errorDetails.digest}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button onClick={handleTryAgain} className={styles.primaryButton}>
            <FaRedo className={styles.buttonIcon} />
            Try Again
          </button>
          <button onClick={handleClearCache} className={styles.secondaryButton}>
            <FaBroom className={styles.buttonIcon} />
            Clear Cache & Retry
          </button>
          <Link href="/" className={styles.tertiaryButton}>
            <FaHome className={styles.buttonIcon} />
            Return Home
          </Link>
          <Link href="/contact" className={styles.quaternaryButton}>
            <FaEnvelope className={styles.buttonIcon} />
            Contact Support
          </Link>
        </div>

        {/* Troubleshooting Tips */}
        <div className={styles.troubleshooting}>
          <h3 className={styles.troubleshootingTitle}>
            <FiAlertTriangle className={styles.sectionIcon} />
            Quick Troubleshooting
          </h3>
          <div className={styles.tipsGrid}>
            <div className={styles.tipCard}>
              <div className={styles.tipIcon}>
                <FaRedo />
              </div>
              <h4>Refresh Page</h4>
              <p>Reload the page to see if the error resolves</p>
            </div>
            <div className={styles.tipCard}>
              <div className={styles.tipIcon}>
                <FaWifi />
              </div>
              <h4>Check Connection</h4>
              <p>Ensure you have a stable internet connection</p>
            </div>
            <div className={styles.tipCard}>
              <div className={styles.tipIcon}>
                <FaBroom />
              </div>
              <h4>Clear Cache</h4>
              <p>Clear browser cache and cookies</p>
            </div>
            <div className={styles.tipCard}>
              <div className={styles.tipIcon}>
                <FaChrome />
              </div>
              <h4>Try Different Browser</h4>
              <p>Access the site from another browser</p>
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className={styles.statusInfo}>
          <h3 className={styles.statusTitle}>
            <FaClock className={styles.sectionIcon} />
            Error Information
          </h3>
          <div className={styles.statusGrid}>
            <div className={styles.statusItem}>
              <FiClock className={styles.statusIcon} />
              <div className={styles.statusContent}>
                <span className={styles.statusLabel}>Timestamp</span>
                <span className={styles.statusValue}>{errorDetails?.timestamp}</span>
              </div>
            </div>
            <div className={styles.statusItem}>
              <FiCode className={styles.statusIcon} />
              <div className={styles.statusContent}>
                <span className={styles.statusLabel}>Error ID</span>
                <span className={styles.statusValue}>{errorDetails?.errorId}</span>
              </div>
            </div>
            <div className={styles.statusItem}>
              <FiChrome className={styles.statusIcon} />
              <div className={styles.statusContent}>
                <span className={styles.statusLabel}>Browser</span>
                <span className={styles.statusValue}>
                  {errorDetails?.userAgent.includes('Chrome') ? 'Chrome' : 
                   errorDetails?.userAgent.includes('Firefox') ? 'Firefox' : 
                   errorDetails?.userAgent.includes('Safari') ? 'Safari' : 'Unknown'}
                </span>
              </div>
            </div>
            <div className={styles.statusItem}>
              <FiWifi className={styles.statusIcon} />
              <div className={styles.statusContent}>
                <span className={styles.statusLabel}>Page</span>
                <span className={styles.statusValue}>
                  {errorDetails?.url ? new URL(errorDetails.url).pathname : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Info (only in development) */}
      {process.env.NODE_ENV === 'development' && errorDetails?.stack && (
        <div className={styles.devInfo}>
          <details className={styles.details}>
            <summary>
              <FaCode className={styles.sectionIcon} />
              Developer Details
            </summary>
            <div className={styles.stackContainer}>
              <pre className={styles.stackTrace}>{errorDetails.stack}</pre>
            </div>
          </details>
        </div>
      )}

      {/* Support Information */}
      <div className={styles.supportInfo}>
        <p>
          If the problem persists, please{' '}
          <Link href="/contact" className={styles.supportLink}>
            contact our support team
          </Link>{' '}
          and provide the Error ID: <strong>{errorDetails?.errorId}</strong>
        </p>
      </div>
    </div>
  );
}