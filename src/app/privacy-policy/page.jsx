"use client";
import React from "react";
import styles from "./LegalPages.module.css";

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last Updated: November 8, 2025</p>
      </div>

      <div className={styles.content}>
        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Introduction</h2>
          <p>
            GammaDevs Technologies Limited {`("GammaDevs," "we," "our," or "us")`} respects your privacy and is committed to protecting any personal information you choose to share with us. This Privacy Policy explains how we collect, use, and protect information provided by visitors and clients through our website www.gammadevs.name.ng.
          </p>
          <p>
            By visiting our website and performing any actions on it, you acknowledge that you have read, understood, and agreed to this Privacy Policy.
          </p>
        </main>

        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
          <p>
            GammaDevs does not automatically collect personal data from visitors.
            The only information we collect is the information you voluntarily provide when contacting us or submitting a project inquiry. This may include:
          </p>
          <ul className={styles.list}>
            <li>Your name</li>
            <li>Your email address or contact details</li>
            <li>Information related to your proposed project or service request</li>
          </ul>
          <p>
            We do not use cookies, trackers, or analytics tools that collect identifiable data.
          </p>
        </main>

        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>3. How We Use the Information</h2>
          <p>
            Any information you provide is used solely for the following purposes:
          </p>
          <ul className={styles.list}>
            <li>To respond to your inquiries or service requests</li>
            <li>To communicate with you regarding proposed projects</li>
            <li>To maintain proper business correspondence</li>
          </ul>
          <p>
            We do not sell, rent, or share your personal information with any third parties.
          </p>
        </main>

        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Data Security</h2>
          <p>
            We take reasonable measures to ensure that all information shared with us is protected from unauthorized access, alteration, or disclosure. However, please note that no method of electronic storage or transmission is 100% secure, and we cannot guarantee absolute security.
          </p>
        </main>

        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Data Retention</h2>
          <p>
            We retain personal information only for as long as necessary to fulfill the purposes for which it was provided or as required by applicable law.
          </p>
        </main>

        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Third-Party Links</h2>
          <p>
            Our website may contain links to external websites or portfolios. We are not responsible for the privacy practices or content of third-party websites. Visitors are encouraged to review the privacy policies of any external sites they visit.
          </p>
        </main>

        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Your Rights</h2>
          <p>
            You may contact us at any time to request that we update or delete any personal information you have shared with us.
          </p>
        </main>

        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Contact Information</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at:
          </p>
          <div className={styles.contactInfo}>
            <p><strong>Email:</strong> info@gammadevs.name.ng</p>
            <p><strong>Company:</strong> GammaDevs Technologies Limited</p>
            <p><strong>Website:</strong> www.gammadevs.name.ng</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;