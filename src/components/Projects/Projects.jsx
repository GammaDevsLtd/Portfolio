import React from "react";
import styles from "./Projects.module.css";
import { PiFigmaLogoBold } from "react-icons/pi";
import { RiNextjsFill, RiTailwindCssFill, RiSupabaseFill } from "react-icons/ri";
import { FaReact, FaNode, FaHtml5, FaCss3Alt, FaPython, FaGithub } from "react-icons/fa";
import { DiMongodb } from "react-icons/di";
import { SiFramer, SiVuedotjs, SiFirebase } from "react-icons/si";
import { IoPrism } from "react-icons/io5";
import { HiMiniCircleStack } from "react-icons/hi2";
import Link from "next/link";

// Updated projects data matching the schema
const projectsData = [
  {
    id: 1,
    title: "Aces Voting",
    description: "A website focused on prompting users to vote for their favorite contestants.",
    detailedDescription: "A comprehensive voting platform with real-time results and user authentication system.",
    category: ["Web App", "Full Stack"],
    images: ["/about.jpg", "/project1-2.jpg"],
    backgroundImage: "/about.jpg",
    liveLink: "#",
    githubLink: "https://github.com/user/aces-voting",
    techStack: [
      { name: "React", value: "FaReact", category: "Frontend" },
      { name: "Node", value: "FaNode", category: "Backend" },
      { name: "MongoDB", value: "DiMongodb", category: "Database" }
    ],
    features: ["Real-time voting", "User authentication", "Admin dashboard"],
    challenges: ["Handling concurrent votes", "Database optimization"],
    solutions: ["Implemented Redis caching", "Used database indexing"],
    status: "Completed",
    timeline: "3 months",
    teamSize: 4,
  },
  {
    id: 2,
    title: "GammaDevs Portfolio",
    description: "A creative studio website showcasing projects and services in web development.",
    detailedDescription: "Modern portfolio website with interactive animations and project showcases.",
    category: ["Portfolio", "Frontend"],
    images: ["/Hero.jpg", "/project2-2.jpg"],
    backgroundImage: "/Hero.jpg",
    liveLink: "#",
    githubLink: "https://github.com/user/gammadevs",
    techStack: [
      { name: "Nextjs", value: "RiNextjsFill", category: "Frontend" },
      { name: "TailwindCSS", value: "RiTailwindCssFill", category: "Frontend" },
      { name: "Framer", value: "SiFramer", category: "Design" }
    ],
    features: ["Responsive design", "Smooth animations", "Project filtering"],
    challenges: ["Performance optimization", "Cross-browser compatibility"],
    solutions: ["Image optimization", "Progressive enhancement"],
    status: "Completed",
    timeline: "2 months",
    teamSize: 2,
  },
  {
    id: 3,
    title: "E-Commerce Hub",
    description: "A full-stack online store with payment integration and user authentication.",
    detailedDescription: "Complete e-commerce solution with inventory management and payment processing.",
    category: ["E-commerce", "Full Stack"],
    images: ["/about.jpg", "/project3-2.jpg"],
    backgroundImage: "/about.jpg",
    liveLink: "#",
    githubLink: "https://github.com/user/ecommerce-hub",
    techStack: [
      { name: "React", value: "FaReact", category: "Frontend" },
      { name: "Python", value: "FaPython", category: "Backend" },
      { name: "Supabase", value: "RiSupabaseFill", category: "Backend" }
    ],
    features: ["Payment integration", "User accounts", "Inventory management"],
    challenges: ["Payment security", "Inventory sync"],
    solutions: ["Stripe integration", "Real-time updates"],
    status: "In Progress",
    timeline: "6 months",
    teamSize: 5,
  },
  {
    id: 4,
    title: "Loft Roots",
    description: "A luxury vehicle marketplace with a focus on high-end, redefined trucks.",
    detailedDescription: "Premium vehicle marketplace featuring luxury trucks with advanced search and filtering.",
    category: ["Marketplace", "Web App"],
    images: ["/Hero.jpg", "/project4-2.jpg"],
    backgroundImage: "/Hero.jpg",
    liveLink: "#",
    githubLink: "https://github.com/user/loft-roots",
    techStack: [
      { name: "Nextjs", value: "RiNextjsFill", category: "Frontend" },
      { name: "Firebase", value: "SiFirebase", category: "Backend" },
      { name: "Figma", value: "PiFigmaLogoBold", category: "Design" }
    ],
    features: ["Advanced search", "Vehicle comparisons", "Dealer accounts"],
    challenges: ["Large image handling", "Search performance"],
    solutions: ["CDN implementation", "Elasticsearch integration"],
    status: "Completed",
    timeline: "4 months",
    teamSize: 3,
  },
  {
    id: 5,
    title: "TaskFlow Pro",
    description: "Project management tool with team collaboration and time tracking.",
    detailedDescription: "Advanced project management platform with real-time collaboration features.",
    category: ["SaaS", "Productivity"],
    images: ["/about.jpg"],
    backgroundImage: "/about.jpg",
    liveLink: "#",
    githubLink: "https://github.com/user/taskflow-pro",
    techStack: [
      { name: "Vue", value: "SiVuedotjs", category: "Frontend" },
      { name: "Node", value: "FaNode", category: "Backend" },
      { name: "MongoDB", value: "DiMongodb", category: "Database" }
    ],
    features: ["Real-time collaboration", "Time tracking", "Team management"],
    challenges: ["Real-time sync", "Data consistency"],
    solutions: ["WebSocket implementation", "Optimistic UI updates"],
    status: "Planned",
    timeline: "5 months",
    teamSize: 6,
  },
  {
    id: 6,
    title: "HealthTrack",
    description: "Fitness tracking application with workout plans and progress analytics.",
    detailedDescription: "Comprehensive fitness app with personalized workout plans and progress tracking.",
    category: ["Mobile", "Health"],
    images: ["/Hero.jpg"],
    backgroundImage: "/Hero.jpg",
    liveLink: "#",
    githubLink: "https://github.com/user/healthtrack",
    techStack: [
      { name: "React", value: "FaReact", category: "Frontend" },
      { name: "Python", value: "FaPython", category: "Backend" },
      { name: "Prism", value: "IoPrism", category: "Tools" }
    ],
    features: ["Workout plans", "Progress tracking", "Social features"],
    challenges: ["Data visualization", "Mobile performance"],
    solutions: ["Chart libraries", "Performance optimization"],
    status: "In Progress",
    timeline: "4 months",
    teamSize: 4,
  },
  {
    id: 7,
    title: "CodeCollab",
    description: "Real-time code collaboration platform for developers.",
    detailedDescription: "Interactive coding environment with real-time collaboration and code execution.",
    category: ["Developer Tools", "Real-time"],
    images: ["/about.jpg"],
    backgroundImage: "/about.jpg",
    liveLink: "#",
    githubLink: "https://github.com/user/codecollab",
    techStack: [
      { name: "React", value: "FaReact", category: "Frontend" },
      { name: "Node", value: "FaNode", category: "Backend" },
      { name: "WebSocket", value: "FaGithub", category: "Tools" }
    ],
    features: ["Real-time editing", "Code execution", "Team collaboration"],
    challenges: ["Conflict resolution", "Code security"],
    solutions: ["Operational transforms", "Sandboxed execution"],
    status: "Completed",
    timeline: "7 months",
    teamSize: 8,
  },
  {
    id: 8,
    title: "DesignHub",
    description: "Collaborative design platform for creative teams.",
    detailedDescription: "All-in-one design collaboration tool with version control and feedback system.",
    category: ["Design", "Collaboration"],
    images: ["/Hero.jpg"],
    backgroundImage: "/Hero.jpg",
    liveLink: "#",
    githubLink: "https://github.com/user/designhub",
    techStack: [
      { name: "Nextjs", value: "RiNextjsFill", category: "Frontend" },
      { name: "Figma", value: "PiFigmaLogoBold", category: "Design" },
      { name: "TailwindCSS", value: "RiTailwindCssFill", category: "Frontend" }
    ],
    features: ["Version control", "Real-time feedback", "Design system"],
    challenges: ["Large file handling", "Real-time updates"],
    solutions: ["Incremental loading", "Efficient diffing algorithms"],
    status: "Planned",
    timeline: "8 months",
    teamSize: 7,
  }
];

// Function to render icon based on string value
const renderIcon = (iconName) => {
  const icons = {
    FaFigma: <PiFigmaLogoBold />,
    FaNode: <FaNode />,
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
  };
  return icons[iconName] || <HiMiniCircleStack />;
};

// Function to get 6 random projects
const getRandomProjects = (projects, count = 6) => {
  const shuffled = [...projects].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const Projects = () => {
  const displayedProjects = getRandomProjects(projectsData, 6);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Our Projects</h1>
      </div>
      <div className={styles.cardGrid}>
        {displayedProjects.map((project) => (
          <div
            key={project.id}
            className={styles.card}
            style={{
              background: `linear-gradient(125deg, rgba(12, 77, 152, 0.4) 1%, rgba(4, 25, 50, 0.4) 66%), url(${project.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Tech Stack Icons */}
            <div className={styles.stacks}>
              {project.techStack.slice(0, 3).map((stack, index) => (
                <div key={index} className={styles.icon} title={stack.name}>
                  {renderIcon(stack.value)}
                </div>
              ))}
              {project.techStack.length > 3 && (
                <div className={styles.moreStacks} title={`+${project.techStack.length - 3} more`}>
                  +{project.techStack.length - 3}
                </div>
              )}
            </div>

            <div className={styles.details}>
              <div className={styles.cardHeader}>
                <h1>{project.title}</h1>
                <span className={`${styles.status} ${styles[project.status.toLowerCase().replace(' ', '-')]}`}>
                  {project.status}
                </span>
              </div>
              <div className={styles.content}>
                <div className={styles.desc}>{project.description}</div>
                <div className={styles.projectMeta}>
                  {project.category.slice(0, 2).map((cat, index) => (
                    <span key={index} className={styles.categoryTag}>{cat}</span>
                  ))}
                </div>
                <div className={styles.cardActions}>
                  {project.liveLink && (
                    <a href={project.liveLink} className={styles.visit} target="_blank" rel="noopener noreferrer">
                      Visit site
                    </a>
                  )}
                  <Link href={`/projects/${project.id}`} className={styles.viewDetails}>
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