import React from "react";
import styles from "./About.module.css";
import Image from "next/image";

const About = () => {
  return (
    <div className={styles.container}>
      <div className={styles.circle}></div>

      <div className={styles.aboutContent}>
        <div className={styles.textarea}>
          <h1 className={styles.title}>Who we are</h1>
          <span className={styles.subtitle}>
            Gamma is a creative technology studio specializing in crafting powerful digital experiences. We offer end-to-end services in website, application, and game development, blending stunning product design with robust engineering.

            <p>
              We collaborate with individuals, startups, and established businesses to transform ideas into market-ready solutions—from Minimum Viable Products (MVPs) to full-scale platforms.
            </p>

            Beyond development, we provide strategic tech consultancy, digital branding, and professional training programs designed to build capacity and empower the next generation of tech talent.
          </span>
        </div>

        <div className={styles.imgcontainer}>
          <div className={styles.imageCard}>
            <div className={styles.imagecontainer}>
              <Image
                src="/about.jpg"
                alt="Keyboard with blue lighting"
                className={styles.img}
                fill
              />
            </div>
            <div className={styles.borderFrame}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
