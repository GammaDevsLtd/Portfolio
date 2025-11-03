import React from 'react'
import styles from "./Hero.module.css"
import Link from 'next/link'

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
            <Link href="/contact" className={styles.launch}>Lauch Your Vision</Link>
            <Link href="/#contact" className={styles.book} >Book a Consultation</Link>
          </div>
        </div>
    </div>
  )
}

export default Hero