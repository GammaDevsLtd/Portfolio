"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./ProjectDetails.module.css";

// 🔹 Import all possible icons
import { PiFigmaLogoBold, PiFileCss, PiFileJs } from "react-icons/pi";
import {
  RiNextjsFill,
  RiGithubFill,
  RiExternalLinkLine,
  RiArrowLeftLine,
} from "react-icons/ri";
import { FaReact, FaPython, FaNodeJs } from "react-icons/fa";
import {
  SiTypescript,
  SiTailwindcss,
  SiMongodb,
  SiPostgresql,
  SiDjango,
} from "react-icons/si";

// 🔹 Map icon strings → actual components
const iconMap = {
  RiNextjsFill: <RiNextjsFill />,
  FaReact: <FaReact />,
  FaPython: <FaPython />,
  FaNodeJs: <FaNodeJs />,
  SiMongodb: <SiMongodb />,
  SiTailwindcss: <SiTailwindcss />,
  SiPostgresql: <SiPostgresql />,
  SiTypescript: <SiTypescript />,
  SiDjango: <SiDjango />,
  PiFigmaLogoBold: <PiFigmaLogoBold />,
  PiFileCss: <PiFileCss />,
  PiFileJs: <PiFileJs />,
};

// 🔹 Fallback mock data for local testing
const mockProjects = {
  1: {
    id: 1,
    title: "Aces Voting",
    category: "Web Development",
    description:
      "A website focused on prompting users to vote for their favorite contestants.",
    detailedDescription:
      "Aces Voting is a comprehensive voting platform that allows users to participate in contests, view real-time results, and share their votes.",
    backgroundImage: "/about.jpg",
    liveLink: "https://aces-voting.demo.com",
    githubLink: "https://github.com/gammadevs/aces-voting",
    techStack: [
      { name: "Next.js", icon: "RiNextjsFill", category: "Frontend" },
      { name: "React", icon: "FaReact", category: "Frontend" },
      { name: "TypeScript", icon: "SiTypescript", category: "Frontend" },
      { name: "Node.js", icon: "FaNodeJs", category: "Backend" },
      { name: "MongoDB", icon: "SiMongodb", category: "Database" },
      { name: "Tailwind CSS", icon: "SiTailwindcss", category: "Styling" },
    ],
    features: [
      "Real-time voting results",
      "Secure user authentication",
      "Social media integration",
      "Admin dashboard for contest management",
    ],
    challenges: [
      "Handling high traffic during peak voting periods",
      "Ensuring vote integrity",
    ],
    solutions: [
      "Implemented Redis caching",
      "Used cryptographic techniques for verification",
    ],
    images: ["/about.jpg", "/admin.png", "/Hero.jpg"],
    status: "Completed",
    timeline: "3 months",
    teamSize: 4,
  },
};

const ProjectDetails = () => {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const projectId = params.id;

  // 🔹 Fetch project from API
  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.warn("Using mock project due to fetch error:", err);
        setProject(mockProjects[projectId]);
      }
    }
    fetchProject();
  }, [projectId]);

  if (!project) {
    return (
      <div className={styles.notFound}>
        <h1>Loading Project...</h1>
      </div>
    );
  }

  // 🔹 Group tech stack by category
  const techByCategory = project.techStack.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = [];
    acc[tech.category].push(tech);
    return acc;
  }, {});

  const nextImage = () =>
    setActiveImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );

  const prevImage = () =>
    setActiveImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );

  return (
    <div className={styles.projectDetails}>
      {/* Header Section */}
      <header className={styles.projectHeader}>
        <div className={styles.headerContent}>
          <button
            onClick={() => router.push("/projects")}
            className={styles.backButton}
          >
            <RiArrowLeftLine /> Back to Projects
          </button>

          <div className={styles.projectMeta}>
            <span className={styles.category}>{project.category}</span>
            <span className={styles.status}>{project.status}</span>
          </div>

          <h1 className={styles.projectTitle}>{project.title}</h1>
          <p className={styles.projectSubtitle}>{project.description}</p>

          <div className={styles.projectActions}>
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.liveLink}
            >
              <RiExternalLinkLine /> Visit Live Site
            </a>
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}
            >
              <RiGithubFill /> View Code
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.projectMain}>
        <div className={styles.container}>
          {/* Gallery */}
          <section className={styles.gallerySection}>
            <div className={styles.gallery}>
              <div className={styles.mainImage}>
                <img
                  src={project.images[activeImageIndex]}
                  alt={`${project.title} screenshot`}
                />
                {project.images.length > 1 && (
                  <>
                    <button className={styles.navButton} onClick={prevImage}>
                      ‹
                    </button>
                    <button className={styles.navButton} onClick={nextImage}>
                      ›
                    </button>
                  </>
                )}
              </div>

              {project.images.length > 1 && (
                <div className={styles.thumbnailGrid}>
                  {project.images.map((img, i) => (
                    <button
                      key={i}
                      className={`${styles.thumbnail} ${
                        i === activeImageIndex ? styles.active : ""
                      }`}
                      onClick={() => setActiveImageIndex(i)}
                    >
                      <img src={img} alt={`Thumbnail ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Project Details Grid */}
          <div className={styles.detailsGrid}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              <section className={styles.descriptionSection}>
                <h2>Project Overview</h2>
                <p>{project.detailedDescription}</p>
              </section>

              <section className={styles.featuresSection}>
                <h2>Key Features</h2>
                <ul className={styles.featuresList}>
                  {project.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </section>

              <section className={styles.techSection}>
                <h2>Technology Stack</h2>
                <div className={styles.techCategories}>
                  {Object.entries(techByCategory).map(
                    ([category, technologies]) => (
                      <div key={category} className={styles.techCategory}>
                        <h3>{category}</h3>
                        <div className={styles.techList}>
                          {technologies.map((tech, i) => (
                            <div key={i} className={styles.techItem}>
                              <span className={styles.techIcon}>
                                {iconMap[tech.icon]}
                              </span>
                              <span>{tech.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className={styles.rightColumn}>
              <div className={styles.infoCard}>
                <h3>Project Details</h3>
                <div className={styles.infoItem}>
                  <strong>Category:</strong>
                  <span>{project.category}</span>
                </div>
                <div className={styles.infoItem}>
                  <strong>Status:</strong>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[project.status.toLowerCase()]
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <strong>Timeline:</strong>
                  <span>{project.timeline}</span>
                </div>
                <div className={styles.infoItem}>
                  <strong>Team Size:</strong>
                  <span>{project.teamSize} people</span>
                </div>
              </div>

              <section className={styles.challengesSection}>
                <h3>Challenges & Solutions</h3>
                <div className={styles.challengeSolution}>
                  <div className={styles.challenges}>
                    <h4>Challenges</h4>
                    <ul>
                      {project.challenges.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.solutions}>
                    <h4>Solutions</h4>
                    <ul>
                      {project.solutions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Have a Similar Project in Mind?</h2>
          <p>Let's discuss how we can bring your vision to life.</p>
          <button
            onClick={() => router.push("/#contact")}
            className={styles.ctaButton}
          >
            Start a Conversation
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
