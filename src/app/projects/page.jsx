"use client";
import React, { useState, useEffect } from "react";
import styles from "./ProjectsPage.module.css";
import { PiFigmaLogoBold } from "react-icons/pi";
import { RiNextjsFill } from "react-icons/ri";
import { FaReact } from "react-icons/fa";
import Link from "next/link";

// Category options from our earlier code
const categoryOptions = [
  { value: "Frontend Websites", label: "Frontend Websites" },
  { value: "Fullstack Websites", label: "Fullstack Websites" },
  { value: "UI UX", label: "UI/UX" },
];

// Pagination settings
const PROJECTS_PER_PAGE = 6;
const LOAD_MORE_COUNT = 3;

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);

  // Function to render icon based on string value
  const renderIcon = (iconName) => {
    const icons = {
      FaFigma: <PiFigmaLogoBold />,
      FaNode: <FaReact />, // Using React icon as fallback for Node
      FaReact: <FaReact />,
      FaHtml5: <FaReact />, // Fallback
      FaCss3Alt: <FaReact />, // Fallback
      FaPython: <FaReact />, // Fallback
      FaGithub: <FaReact />, // Fallback
      RiNextjsFill: <RiNextjsFill />,
      RiTailwindCssFill: <FaReact />, // Fallback
      RiSupabaseFill: <FaReact />, // Fallback
      DiMongodb: <FaReact />, // Fallback
      SiFramer: <PiFigmaLogoBold />, // Using Figma as fallback for Framer
      SiVuedotjs: <FaReact />, // Fallback
      SiFirebase: <FaReact />, // Fallback
      IoPrism: <FaReact />, // Fallback
    };
    return icons[iconName] || <FaReact />;
  };

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/projects");
        
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects by category
  const filteredProjects = activeCategory === "All Projects" 
    ? projects 
    : projects.filter(project => 
        project.category.includes(activeCategory)
      );

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(PROJECTS_PER_PAGE);
  }, [activeCategory]);

  // Get projects to display (limited by visibleCount)
  const projectsToShow = filteredProjects.slice(0, visibleCount);

  // Check if there are more projects to load
  const hasMoreProjects = visibleCount < filteredProjects.length;

  // Load more projects function
  const loadMoreProjects = () => {
    setLoadingMore(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCount(prevCount => prevCount + LOAD_MORE_COUNT);
      setLoadingMore(false);
    }, 300);
  };

  // Get all unique categories from projects for filter buttons
  const allCategories = ["All Projects", ...categoryOptions.map(cat => cat.value)];

  if (loading) {
    return (
      <div className={styles.projectsPage}>
        <header className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>Our Projects</h1>
            <p className={styles.pageSubtitle}>
              Discover our portfolio of innovative digital solutions that empower and inspire
            </p>
            <div className={styles.headerLine}></div>
          </div>
        </header>
        
        <main className={styles.projectsMain}>
          <div className={styles.container}>
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading projects...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.projectsPage}>
        <header className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>Our Projects</h1>
            <p className={styles.pageSubtitle}>
              Discover our portfolio of innovative digital solutions that empower and inspire
            </p>
            <div className={styles.headerLine}></div>
          </div>
        </header>
        
        <main className={styles.projectsMain}>
          <div className={styles.container}>
            <div className={styles.errorState}>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className={styles.retryBtn}
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
          {/* Categories Filter */}
          <div className={styles.categories}>
            {allCategories.map((category) => (
              <button
                key={category}
                className={`${styles.categoryBtn} ${
                  activeCategory === category ? styles.active : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Count */}
          <div className={styles.projectsCount}>
            Showing {projectsToShow.length} of {filteredProjects.length} projects
            {activeCategory !== "All Projects" && ` in ${activeCategory}`}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No projects found</h3>
              <p>
                {activeCategory === "All Projects" 
                  ? "We're working on some amazing projects. Check back soon!"
                  : `No ${activeCategory} projects found. Try another category.`
                }
              </p>
            </div>
          ) : (
            <>
              <div className={styles.projectsGrid}>
                {projectsToShow.map((project) => (
                  <div
                    key={project._id || project.id}
                    className={styles.projectCard}
                    style={{
                      background: `linear-gradient(125deg, rgba(12, 77, 152, 0.4) 1%, rgba(4, 25, 50, 0.4) 66%), url(${project.backgroundImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    {/* Category Badge - show first category */}
                    {project.category && project.category.length > 0 && (
                      <div className={styles.categoryBadge}>
                        {project.category[0]}
                      </div>
                    )}
                    
                    {/* Tech Stack Icons */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className={styles.techStack}>
                        {project.techStack.slice(0, 3).map((tech, index) => (
                          <div 
                            key={index} 
                            className={styles.techIcon}
                            title={tech.name}
                          >
                            {renderIcon(tech.value)}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Project Content */}
                    <div className={styles.projectContent}>
                      <div className={styles.projectHeader}>
                        <h3 className={styles.projectTitle}>{project.title}</h3>
                      </div>
                      <div className={styles.projectBody}>
                        <p className={styles.projectDescription}>
                          {project.description}
                        </p>
                        <div className={styles.projectActions}>
                          {project.liveLink && project.liveLink !== "#" && (
                            <a 
                              href={project.liveLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={styles.visitBtn}
                            >
                              Visit Site
                            </a>
                          )}
                          
                          {/* View Details Link - Using Next.js Link for client-side navigation */}
                          <Link 
                            href={`/projects/${project._id || project.id}`}
                            className={styles.detailsBtn}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Section */}
              {hasMoreProjects && (
                <div className={styles.loadMoreSection}>
                  <button 
                    onClick={loadMoreProjects}
                    className={styles.loadMoreBtn}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <div className={styles.smallSpinner}></div>
                        Loading...
                      </>
                    ) : (
                      `Load ${Math.min(LOAD_MORE_COUNT, filteredProjects.length - visibleCount)} More Projects`
                    )}
                  </button>
                </div>
              )}

              {/* All projects loaded message */}
              {!hasMoreProjects && filteredProjects.length > PROJECTS_PER_PAGE && (
                <div className={styles.allLoadedMessage}>
                  <p>All projects loaded! 🎉</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Have a Project in Mind?</h2>
          <p className={styles.ctaText}>
            Let's collaborate to build something amazing together
          </p>
          <Link href="/#contact" className={styles.ctaBtn}>
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;