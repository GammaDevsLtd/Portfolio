"use client"
import React, { useState, useEffect } from "react";
import styles from "./Projects.module.css";
import { PiFigmaLogoBold } from "react-icons/pi";
import { RiNextjsFill, RiTailwindCssFill, RiSupabaseFill } from "react-icons/ri";
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaPython, FaGithub } from "react-icons/fa";
import { IoRocket } from "react-icons/io5";
import { DiMongodb } from "react-icons/di";
import { SiFramer, SiVuedotjs, SiFirebase } from "react-icons/si";
import { IoPrism } from "react-icons/io5";
import { HiMiniCircleStack } from "react-icons/hi2";
import Link from "next/link";


// Function to render icon based on string value
const renderIcon = (iconName) => {
  console.log('Looking for icon:', iconName);
  const icons = {
    FaFigma: <PiFigmaLogoBold />,
    FaNode: <FaNodeJs />, // Now maps to FaNodeJs
    FaReact: <FaReact />,
    FaHtml5: <FaHtml5 />,
    FaCss3Alt: <FaCss3Alt />,
    FaPython: <FaPython />,
    FaGithub: <FaGithub />,
    RiNextjsFill: <RiNextjsFill />,
    RiTailwindCssFill: <RiTailwindCssFill />,
    RiSupabaseFill: <RiSupabaseFill />,
    DiMongodb: <DiMongodb />,
    SiFramer: <SiFramer />,
    SiVuedotjs: <SiVuedotjs />,
    SiFirebase: <SiFirebase />,
    IoPrism: <IoPrism />,
    PiFigmaLogoBold: <PiFigmaLogoBold />,
  };
  
  if (!icons[iconName]) {
    console.warn(`Icon not found: ${iconName}`);
    console.log('Available icons:', Object.keys(icons));
  }
  
  return icons[iconName] || <HiMiniCircleStack />;
};

// Function to get 6 random projects
const getRandomProjects = (projects, count = 6) => {
  const shuffled = [...projects].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const displayedProjects = getRandomProjects(projects, 6);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Our Projects</h1>
        </div>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Our Projects</h1>
        </div>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Our Projects</h1>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <IoRocket/>
          </div>
          <h3>No Projects Yet</h3>
          <p>We're working on some amazing projects. Check back soon to see our work!</p>
          <div className={styles.emptyActions}>
            <Link href="/contact" className={styles.contactLink}>
              Start a Project
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className={styles.refreshLink}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Our Projects</h1>
      </div>
      <div className={styles.cardGrid}>
        {displayedProjects.map((project) => (
          <div
            key={project._id}
            className={styles.card}
            style={{
              background: `linear-gradient(125deg, rgba(12, 77, 152, 0.4) 1%, rgba(4, 25, 50, 0.4) 66%), url(${project.backgroundImage || '/default-project.jpg'})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Tech Stack Icons */}
            <div className={styles.stacks}>
              {project.techStack?.slice(0, 3).map((stack, index) => (
                <div key={index} className={styles.icon} title={stack.name}>
                  {renderIcon(stack.value)}
                </div>
              ))}
              {project.techStack?.length > 3 && (
                <div className={styles.moreStacks} title={`+${project.techStack.length - 3} more`}>
                  +{project.techStack.length - 3}
                </div>
              )}
            </div>

            <div className={styles.details}>
              <div className={styles.cardHeader}>
                <h1>{project.title}</h1>
                <span className={`${styles.status} ${styles[project.status?.toLowerCase().replace(' ', '-')] || styles.completed}`}>
                  {project.status || 'Completed'}
                </span>
              </div>
              <div className={styles.content}>
                <div className={styles.desc}>{project.description}</div>
                <div className={styles.projectMeta}>
                  {project.category?.slice(0, 2).map((cat, index) => (
                    <span key={index} className={styles.categoryTag}>{cat}</span>
                  ))}
                </div>
                <div className={styles.cardActions}>
                  {project.liveLink && (
                    <a href={project.liveLink} className={styles.visit} target="_blank" rel="noopener noreferrer">
                      Visit site
                    </a>
                  )}
                  <Link href={`/projects/${project._id}`} className={styles.viewDetails}>
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link href="/projects" className={styles.view}>View All Projects</Link>
    </div>
  );
};

export default Projects;