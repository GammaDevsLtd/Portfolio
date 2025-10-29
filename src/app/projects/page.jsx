import React from "react";
import styles from "./ProjectsPage.module.css";
import { PiFigmaLogoBold } from "react-icons/pi";
import { RiNextjsFill } from "react-icons/ri";
import { FaReact } from "react-icons/fa";

const projectsData = [
  {
    id: 1,
    title: "Aces Voting",
    description: "A website focused on prompting users to vote for their favorite contestants.",
    backgroundImage: "/about.jpg",
    link: "#",
    category: "Web Development"
  },
  {
    id: 2,
    title: "GammaDevs Portfolio",
    description: "A creative studio website showcasing projects and services in web development.",
    backgroundImage: "/Hero.jpg",
    link: "#",
    category: "Web Design"
  },
  {
    id: 3,
    title: "E-Commerce Hub",
    description: "A full-stack online store with payment integration and user authentication.",
    backgroundImage: "/about.jpg",
    link: "#",
    category: "E-Commerce"
  },
  {
    id: 4,
    title: "Loft Roots",
    description: "A luxury vehicle marketplace with a focus on high-end, redefined trucks.",
    backgroundImage: "/Hero.jpg",
    link: "#",
    category: "Web Development"
  },
  {
    id: 5,
    title: "Tech Learning Platform",
    description: "Interactive platform for digital skills training and mentorship programs.",
    backgroundImage: "/about.jpg",
    link: "#",
    category: "Education"
  },
  {
    id: 6,
    title: "Business Solutions Suite",
    description: "Comprehensive business management tools for startups and enterprises.",
    backgroundImage: "/Hero.jpg",
    link: "#",
    category: "SaaS"
  },
];

const ProjectsPage = () => {
  return (
    <div className={styles.projectsPage}>
      {/* Page Header */}
      <header className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Our Projects</h1>
          <p className={styles.pageSubtitle}>
            Discover our portfolio of innovative digital solutions that empower and inspire
          </p>
          <div className={styles.headerLine}></div>
        </div>
      </header>

      {/* Projects Grid */}
      <main className={styles.projectsMain}>
        <div className={styles.container}>
          {/* Optional: Categories Filter */}
          <div className={styles.categories}>
            <button className={`${styles.categoryBtn} ${styles.active}`}>All Projects</button>
            <button className={styles.categoryBtn}>Web Development</button>
            <button className={styles.categoryBtn}>Web Design</button>
            <button className={styles.categoryBtn}>E-Commerce</button>
            <button className={styles.categoryBtn}>SaaS</button>
          </div>

          {/* Projects Grid */}
          <div className={styles.projectsGrid}>
            {projectsData.map((project) => (
              <div
                key={project.id}
                className={styles.projectCard}
                style={{
                  background: `linear-gradient(125deg, rgba(12, 77, 152, 0.4) 1%, rgba(4, 25, 50, 0.4) 66%), url(${project.backgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Category Badge */}
                <div className={styles.categoryBadge}>{project.category}</div>
                
                {/* Tech Stack Icons */}
                <div className={styles.techStack}>
                  <div className={styles.techIcon}>
                    <PiFigmaLogoBold />
                  </div>
                  <div className={styles.techIcon}>
                    <RiNextjsFill />
                  </div>
                  <div className={styles.techIcon}>
                    <FaReact />
                  </div>
                </div>

                {/* Project Content */}
                <div className={styles.projectContent}>
                  <div className={styles.projectHeader}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                  </div>
                  <div className={styles.projectBody}>
                    <p className={styles.projectDescription}>{project.description}</p>
                    <div className={styles.projectActions}>
                      <button className={styles.visitBtn}>Visit Site</button>
                      <button className={styles.detailsBtn}>View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Section */}
          <div className={styles.loadMoreSection}>
            <button className={styles.loadMoreBtn}>
              Load More Projects
            </button>
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Have a Project in Mind?</h2>
          <p className={styles.ctaText}>
            Let's collaborate to build something amazing together
          </p>
          <button className={styles.ctaBtn}>Start a Project</button>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;