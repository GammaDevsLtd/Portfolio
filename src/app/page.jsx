import React from "react";
import styles from "./home.module.css";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Serve from "@/components/Serve/Serve";
import { Team } from "@/components/Team/Team";
import Projects from "@/components/Projects/Projects";
import Contact from "@/components/Contact/Contact";

const homePage = () => {
  return (
    <div className={styles.container}>
      <section className={styles.section} id="home">
        <Hero />
      </section>
      <section className={styles.section} id="about">
        <About />
      </section>
      <section className={styles.section}>
        <Serve />
      </section>
      <section className={styles.section} id="team">
        <Team/>
      </section>
      <section className={styles.section} id="projects">
        <Projects/>
      </section>
      <section className={styles.section} id="contact">
        <Contact/>
      </section>
    </div>
  );
};

export default homePage;
