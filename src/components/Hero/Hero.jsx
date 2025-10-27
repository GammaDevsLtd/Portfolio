import React from 'react'
import styles from "./Hero.module.css"

const Hero = () => {
  return (
    <div className={styles.container}>
        <div className={styles.herotext}>
          <span className={styles.title}>
              GammaDevs Technologies Limited
          </span>
          <p className={styles.subtitle}>
            By Building Tech Experiences that Empower and Inspire
          </p>
          <div className={styles.buttons}>
            <button className={styles.launch}>Lauch Your Vision</button>
            <button className={styles.book} >Book a Consultation</button>
          </div>
        </div>
    </div>
  )
}

export default Hero