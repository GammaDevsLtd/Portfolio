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
      <section id="home">
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
      <section>
        <Serve />
      </section>
      <section id="team">
        <Team/>
      </section>
      <section id="projects">
        <Projects/>
      </section>
      <section id="contact">
        <Contact/>
      </section>
    </div>
  );
};

export default homePage;
