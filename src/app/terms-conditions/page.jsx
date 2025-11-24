"use client";
import React from "react";
import styles from "./LegalPages.module.css";

const TermsConditions = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Terms of Use</h1>
        <p className={styles.lastUpdated}>Last Updated: November 8, 2025</p>
      </div>

      <div className={styles.content}>
        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
          <p>
            By visiting, browsing, or performing any actions on www.gammadevs.name.ng, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree, you must discontinue use of the website immediately.
          </p>
        </main>

        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Ownership and Intellectual Property</h2>
          <p>
            All content, graphics, designs, logos, and materials displayed on this website are the exclusive property of GammaDevs Technologies Limited. Unauthorized use, reproduction, or distribution of any content without written consent is strictly prohibited.
          </p>
        </main>

        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Use of the Website</h2>
          <p>
            You agree to use this website only for lawful purposes and in a manner that does not:
          </p>
          <ul className={styles.list}>
            <li>Infringe on the rights of others</li>
            <li>Disrupt or damage the {`website's`} functionality</li>
            <li>Misrepresent your identity or intent when contacting us</li>
          </ul>
          <p>
            You may not attempt to gain unauthorized access to our systems or use the website for fraudulent purposes.
          </p>
        </main>

        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Service Descriptions</h2>
          <p>
            GammaDevs Technologies Limited provides information about its services, such as web development, UI/UX design, mobile app development, and technology consultation.
            While we make every effort to keep information accurate and up to date, we do not guarantee that descriptions, pricing, or service details are always error-free.
          </p>
        </main>

        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Limitation of Liability</h2>
          <p>
            GammaDevs Technologies Limited is not liable for any damages, direct or indirect, arising from your use of or inability to use the website.
            We do not guarantee uninterrupted access, accuracy, or security of the site.
          </p>
        </main>

        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Links to Third Parties</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the content or practices of those external sites.
          </p>
        </main>

        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Changes to Terms</h2>
          <p>
            GammaDevs Technologies Limited reserves the right to update or modify these Terms of Use at any time without prior notice. The updated version will be posted on this page, and continued use of the website constitutes acceptance of any changes.
          </p>
        </main>

        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Governing Law</h2>
          <p>
            These Terms of Use shall be governed by and construed in accordance with the laws applicable in the Federal Republic of Nigeria, without regard to conflict of law principles.
          </p>
        </main>

        <main className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Contact Information</h2>
          <p>
            If you have questions about these Terms of Use, please contact us at:
          </p>
          <div className={styles.contactInfo}>
            <p><strong>Email:</strong> gammadevs0@gmail.com</p>
            <p><strong>Company:</strong> GammaDevs Technologies Limited</p>
            <p><strong>Website:</strong> www.gammadevs.name.ng</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TermsConditions;