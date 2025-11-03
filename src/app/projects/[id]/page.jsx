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
import {
  FaReact,
  FaPython,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaGithub,
  FaFigma,
  FaNode,
} from "react-icons/fa";
import {
  SiTypescript,
  SiTailwindcss,
  SiMongodb,
  SiPostgresql,
  SiDjango,
  SiFramer,
  SiVuedotjs,
  SiFirebase,
  SiSupabase,
} from "react-icons/si";
import { DiMongodb } from "react-icons/di";
import { IoPrism } from "react-icons/io5";
import { HiMiniCircleStack } from "react-icons/hi2";

// 🔹 Map icon strings → actual components (matching your Projects component)
const iconMap = {
  FaFigma: <FaFigma />,
  FaNode: <FaNode />,
  FaReact: <FaReact />,
  FaHtml5: <FaHtml5 />,
  FaCss3Alt: <FaCss3Alt />,
  FaPython: <FaPython />,
  FaGithub: <FaGithub />,
  RiNextjsFill: <RiNextjsFill />,
  RiTailwindCssFill: <SiTailwindcss />,
  RiSupabaseFill: <SiSupabase />,
  DiMongodb: <DiMongodb />,
  SiFramer: <SiFramer />,
  SiVuedotjs: <SiVuedotjs />,
  SiFirebase: <SiFirebase />,
  IoPrism: <IoPrism />,
  // Fallbacks
  FaNodeJs: <FaNode />,
  SiMongodb: <DiMongodb />,
  SiTailwindcss: <SiTailwindcss />,
  SiTypescript: <SiTypescript />,
  SiPostgresql: <SiPostgresql />,
  SiDjango: <SiDjango />,
  PiFigmaLogoBold: <FaFigma />,
  PiFileCss: <FaCss3Alt />,
  PiFileJs: <FaReact />,
};

const ProjectDetails = () => {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const projectId = params.id;

  // 🔹 Fetch project from API
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/projects/${projectId}`);

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Project not found");
          }
          throw new Error("Failed to fetch project");
        }

        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(
          err.message || "Failed to load project. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  // 🔹 Group tech stack by category
  const techByCategory =
    project?.techStack?.reduce((acc, tech) => {
      if (!acc[tech.category]) acc[tech.category] = [];
      acc[tech.category].push(tech);
      return acc;
    }, {}) || {};

  const nextImage = () => {
    if (project?.images?.length > 1) {
      setActiveImageIndex((prev) =>
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (project?.images?.length > 1) {
      setActiveImageIndex((prev) =>
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.projectDetails}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <h2>Loading Project...</h2>
          <p>Please wait while we fetch the project details</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.projectDetails}>
        <div className={styles.errorState}>
          <h2>Unable to Load Project</h2>
          <p>{error}</p>
          <div className={styles.errorActions}>
            <button
              onClick={() => router.push("/projects")}
              className={styles.backButton}
            >
              <RiArrowLeftLine /> Back to Projects
            </button>
            <button
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Project not found state
  if (!project) {
    return (
      <div className={styles.projectDetails}>
        <div className={styles.notFound}>
          <h1>Project Not Found</h1>
          <p>
            The project you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/projects")}
            className={styles.backButton}
          >
            <RiArrowLeftLine /> Back to Projects
          </button>
        </div>
      </div>
    );
  }

  // Get first category for display
  const displayCategory = project.category?.[0] || "Project";
  // Get display images (use backgroundImage as fallback)
  const displayImages =
    project.images?.length > 0
      ? project.images
      : [project.backgroundImage].filter(Boolean);

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
            {displayCategory && (
              <span className={styles.category}>{displayCategory}</span>
            )}
            <span
              className={`${styles.status} ${
                styles[project.status?.toLowerCase()] || ""
              }`}
            >
              {project.status}
            </span>
          </div>

          <h1 className={styles.projectTitle}>{project.title}</h1>
          <p className={styles.projectSubtitle}>{project.description}</p>

          <div className={styles.projectActions}>
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.liveLink}
              >
                <RiExternalLinkLine /> Visit Live Site
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.githubLink}
              >
                <RiGithubFill /> View Code
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.projectMain}>
        <div className={styles.container}>
          {/* Gallery */}
          {displayImages.length > 0 && (
            <section className={styles.gallerySection}>
              <div className={styles.gallery}>
                <div className={styles.mainImage}>
                  <img
                    src={displayImages[activeImageIndex]}
                    alt={`${project.title} screenshot`}
                  />
                  {displayImages.length > 1 && (
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

                {displayImages.length > 1 && (
                  <div className={styles.thumbnailGrid}>
                    {displayImages.map((img, i) => (
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
          )}

          {/* Project Details Grid */}
          <div className={styles.detailsGrid}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              {project.detailedDescription && (
                <section className={styles.descriptionSection}>
                  <h2>Project Overview</h2>
                  <p>{project.detailedDescription}</p>
                </section>
              )}

              {project.features && project.features.length > 0 && (
                <section className={styles.featuresSection}>
                  <h2>Key Features</h2>
                  <ul className={styles.featuresList}>
                    {project.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </section>
              )}

              {project.techStack && project.techStack.length > 0 && (
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
                                  {iconMap[tech.value] || <HiMiniCircleStack />}
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
              )}
            </div>

            {/* Right Column */}
            <div className={styles.rightColumn}>
              <div className={styles.infoCard}>
                <h3>Project Details</h3>
                {project.category && project.category.length > 0 && (
                  <div className={styles.infoItem}>
                    <strong>Categories:</strong>
                    <span>{project.category.join(", ")}</span>
                  </div>
                )}
                <div className={styles.infoItem}>
                  <strong>Status:</strong>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[project.status?.toLowerCase()] || ""
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                {project.timeline && (
                  <div className={styles.infoItem}>
                    <strong>Timeline:</strong>
                    <span>{project.timeline}</span>
                  </div>
                )}
                {project.teamSize && (
                  <div className={styles.infoItem}>
                    <strong>Team Size:</strong>
                    <span>
                      {project.teamSize}{" "}
                      {project.teamSize === 1 ? "person" : "people"}
                    </span>
                  </div>
                )}
              </div>

              {(project.challenges?.length > 0 ||
                project.solutions?.length > 0) && (
                <section className={styles.challengesSection}>
                  <h3>Challenges & Solutions</h3>
                  <div className={styles.challengeSolution}>
                    {project.challenges?.length > 0 && (
                      <div className={styles.challenges}>
                        <h4>Challenges</h4>
                        <ul>
                          {project.challenges.map((challenge, i) => (
                            <li key={i}>{challenge}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {project.solutions?.length > 0 && (
                      <div className={styles.solutions}>
                        <h4>Solutions</h4>
                        <ul>
                          {project.solutions.map((solution, i) => (
                            <li key={i}>{solution}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              )}
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
