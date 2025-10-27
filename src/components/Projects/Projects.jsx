import React from "react";
import styles from "./Projects.module.css";
import { PiFigmaLogoBold } from "react-icons/pi";
import { RiNextjsFill } from "react-icons/ri";
import { FaReact } from "react-icons/fa";

const projectsData = [
  {
    id: 1,
    title: "Aces Voting",
    description:
      "A website focused on prompting users to vote for their favorite contestants.",
    backgroundImage: "/about.jpg", // Path to your image
    link: "#",
  },
  {
    id: 2,
    title: "GammaDevs Portfolio",
    description:
      "A creative studio website showcasing projects and services in web development.",
    backgroundImage: "/Hero.jpg",
    link: "#",
  },
  {
    id: 3,
    title: "E-Commerce Hub",
    description:
      "A full-stack online store with payment integration and user authentication.",
    backgroundImage: "/about.jpg",
    link: "#",
  },
  {
    id: 4,
    title: "Loft Roots",
    description:
      "A luxury vehicle marketplace with a focus on high-end, redefined trucks.",
    backgroundImage: "/Hero.jpg",
    link: "#",
  },
];

const Projects = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Our Projects</h1>
      </div>
      <div className={styles.cardGrid}>
        {projectsData.map((data, i) => (
          <div
            key={data.id}
            className={styles.card}
            style={{
              background: `linear-gradient(125deg, rgba(12, 77, 152, 0.4) 1%, rgba(4, 25, 50, 0.4) 66%), url(${data.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className={styles.stacks}>
              <div className={styles.icon}>
                <PiFigmaLogoBold />
              </div>
              <div className={styles.icon}>
                <RiNextjsFill />
              </div>
              <div className={styles.icon}>
                <FaReact />
              </div>
            </div>
            <div className={styles.details}>
              <div className={styles.cardHeader}>
                <h1>{data.title}</h1>
              </div>
              <div className={styles.content}>
                <div className={styles.desc}>{data.description}</div>
                <button className={styles.visit}>Visit site</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <span className={styles.view}>View All Projects</span>
    </div>
  );
};

export default Projects;
