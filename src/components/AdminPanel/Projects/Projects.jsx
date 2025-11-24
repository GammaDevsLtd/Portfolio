"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Projects.module.css";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiImage,
  FiExternalLink,
  FiEye,
  FiGithub,
} from "react-icons/fi";
import FlexibleSelect from "@/components/UI/FlexibleSelect/FlexibleSelect";
import axios from "axios";

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;

// IMPORTED ICON STACKS
import {
  FaFigma,
  FaNodeJs,
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaPython,
  FaGithub,
} from "react-icons/fa";
import {
  RiNextjsFill,
  RiTailwindCssFill,
  RiSupabaseFill,
} from "react-icons/ri";
import { DiMongodb } from "react-icons/di";
import { SiFramer, SiVuedotjs, SiFirebase } from "react-icons/si";
import { IoPrism } from "react-icons/io5";
import { HiMiniCircleStack } from "react-icons/hi2";

// Category options - matches your requirements
const categoryOptions = [
  { value: "Frontend Websites", label: "Frontend Websites" },
  { value: "Fullstack Websites", label: "Fullstack Websites" },
  { value: "UI UX", label: "UI/UX" },
];

const initialProjects = [
  {
    id: 1,
    title: "Aces Voting",
    description:
      "A website focused on prompting users to vote for their favorite contestants.",
    detailedDescription:
      "A comprehensive voting platform with real-time results and user authentication.",
    category: ["Web App", "Full Stack"],
    images: ["/about.jpg", "/project1-2.jpg"],
    backgroundImage: "/about.jpg",
    liveLink: "https://aces-voting.com",
    githubLink: "https://github.com/user/aces-voting",
    techStack: [
      { name: "React", value: "FaReact", category: "Frontend" },
      { name: "HTML5", value: "FaHtml5", category: "Frontend" },
    ],
    features: ["Real-time voting", "User authentication", "Admin dashboard"],
    challenges: ["Handling concurrent votes", "Database optimization"],
    solutions: ["Implemented Redis caching", "Used database indexing"],
    status: "Completed",
    timeline: "3 months",
    teamSize: 4,
  },
];

const availableStacks = [
  { name: "Figma", value: "FaFigma", category: "Design" },
  { name: "Node.js", value: "FaNodeJs", category: "Backend" },
  { name: "React", value: "FaReact", category: "Frontend" },
  { name: "HTML5", value: "FaHtml5", category: "Frontend" },
  { name: "CSS", value: "FaCss3Alt", category: "Frontend" },
  { name: "Python", value: "FaPython", category: "Backend" },
  { name: "GitHub", value: "FaGithub", category: "Tools" },
  { name: "Next.js", value: "RiNextjsFill", category: "Frontend" },
  { name: "Tailwind CSS", value: "RiTailwindCssFill", category: "Frontend" },
  { name: "Supabase", value: "RiSupabaseFill", category: "Backend" },
  { name: "MongoDB", value: "DiMongodb", category: "Database" },
  { name: "Framer", value: "SiFramer", category: "Design" },
  { name: "Vue.js", value: "SiVuedotjs", category: "Frontend" },
  { name: "Firebase", value: "SiFirebase", category: "Backend" },
  { name: "Prisma", value: "IoPrism", category: "Tools" }, // Corrected name for clarity
];

const statusOptions = [
  { value: "Planned", label: "Planned" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

const Projects = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [viewingProject, setViewingProject] = useState(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    detailedDescription: "",
    category: [],
    images: [],
    backgroundImage: "",
    liveLink: "",
    githubLink: "",
    techStack: [],
    features: [],
    challenges: [],
    solutions: [],
    status: "Planned",
    timeline: "",
    teamSize: 1,
  });

  // State to manage the selected stack from the dropdown before adding it
  const [newStack, setNewStack] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newFeature, setNewFeature] = useState("");
  const [newChallenge, setNewChallenge] = useState("");
  const [newSolution, setNewSolution] = useState("");
  const [backgroundImageFile, setBackgroundImageFile] = useState(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState(null);
  const [projectImagesFiles, setProjectImagesFiles] = useState([]);
  const [projectImagesPreviews, setProjectImagesPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const backgroundFileInputRef = useRef(null);
  const projectImagesFileInputRef = useRef(null);

  // Function to render icon based on string value or tech name
  const renderIcon = (iconKeyOrName) => {
    const icons = {
      FaFigma: <FaFigma />,
      FaNodeJs: <FaNodeJs />, // Key now matches component name
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

    if (iconKeyOrName && icons[iconKeyOrName]) return icons[iconKeyOrName];

    const name = String(iconKeyOrName || "").trim().toLowerCase();
    const nameMap = {
      react: <FaReact />,
      node: <FaNodeJs />,
      'node.js': <FaNodeJs />,
      'nodejs': <FaNodeJs />,
      tailwind: <RiTailwindCssFill />,
      tailwindcss: <RiTailwindCssFill />,
      github: <FaGithub />,
      figma: <FaFigma />,
      html: <FaHtml5 />,
      css: <FaCss3Alt />,
      python: <FaPython />,
      mongodb: <DiMongodb />,
      framer: <SiFramer />,
      vue: <SiVuedotjs />,
      firebase: <SiFirebase />,
      prisma: <IoPrism />,
    };

    return nameMap[name] || <HiMiniCircleStack />;
  };

  // Cloudinary upload function
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", CLOUDINARY_FOLDER);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image");
    }
  };

  // Handle background image file selection
  const handleBackgroundImageChange = (e, isNew = false) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setBackgroundImageFile(file);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setBackgroundImagePreview(previewUrl);

    // Update the appropriate state
    if (isNew) {
      setNewProject((prev) => ({ ...prev, backgroundImage: previewUrl }));
    } else {
      setEditingProject((prev) => ({ ...prev, backgroundImage: previewUrl }));
    }

    setError("");
  };

  // Handle project images file selection (up to 3)
  const handleProjectImagesChange = (e, isNew = false) => {
    const files = Array.from(e.target.files);

    // Limit to 3 images
    if (files.length > 3) {
      setError("You can only upload up to 3 project images");
      return;
    }

    // Validate each file
    for (let file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Please select image files only");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Each image must be less than 10MB");
        return;
      }
    }

    setProjectImagesFiles(files);

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setProjectImagesPreviews(previews);

    // Update the appropriate state
    if (isNew) {
      setNewProject((prev) => ({ ...prev, images: previews }));
    } else {
      setEditingProject((prev) => ({ ...prev, images: previews }));
    }

    setError("");
  };

  // Remove a project image
  const removeProjectImage = (index, isNew = false) => {
    if (isNew) {
      const newPreviews = [...projectImagesPreviews];
      const newFiles = [...projectImagesFiles];

      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      newFiles.splice(index, 1);

      setProjectImagesPreviews(newPreviews);
      setProjectImagesFiles(newFiles);
      setNewProject((prev) => ({ ...prev, images: newPreviews }));
    } else {
      const newPreviews = [...projectImagesPreviews];
      const newFiles = [...projectImagesFiles];

      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      newFiles.splice(index, 1);

      setProjectImagesPreviews(newPreviews);
      setProjectImagesFiles(newFiles);
      setEditingProject((prev) => ({ ...prev, images: newPreviews }));
    }
  };

  // Handle category selection
  const handleCategoryChange = (category, isNew = false) => {
    if (isNew) {
      setNewProject((prev) => {
        const newCategories = prev.category.includes(category)
          ? prev.category.filter((cat) => cat !== category)
          : [...prev.category, category];
        return { ...prev, category: newCategories };
      });
    } else {
      setEditingProject((prev) => {
        const newCategories = prev.category.includes(category)
          ? prev.category.filter((cat) => cat !== category)
          : [...prev.category, category];
        return { ...prev, category: newCategories };
      });
    }
  };

  // Clear previews when component unmounts or modals close
  useEffect(() => {
    return () => {
      if (backgroundImagePreview) {
        URL.revokeObjectURL(backgroundImagePreview);
      }
      projectImagesPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [backgroundImagePreview, projectImagesPreviews]);

  // API functions

  // In your JSX component, update these functions:

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(
        data.map((project) => ({
          ...project,
          id: project._id, // Normalize ID for frontend use
        }))
      );
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects");
    }
  };

  const createProject = async (projectData) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project");
      }

      const result = await response.json();

      // Update local state instead of reloading
      setProjects((prev) => [
        ...prev,
        { ...result.project, id: result.project._id },
      ]);
      setSuccess("Project added successfully!");
      setIsAdding(false);

      // No need to reload the page; local state is already updated

      return result.project;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const response = await fetch(`/api/projects`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...projectData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update project");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  };

  const deleteProject = async (id) => {
    try {
      const response = await fetch(`/api/projects`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete project");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  };

  // --- Array Management Functions ---
  const handleAddToArray = (field, value, isNew = false) => {
    if (value.trim()) {
      if (isNew) {
        setNewProject((prev) => ({
          ...prev,
          [field]: [...prev[field], value.trim()],
        }));
      } else {
        setEditingProject((prev) => ({
          ...prev,
          [field]: [...prev[field], value.trim()],
        }));
      }
    }
  };

  const handleRemoveFromArray = (field, index, isNew = false) => {
    if (isNew) {
      setNewProject((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    } else {
      setEditingProject((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  // --- Stack Management Functions ---
  const handleAddStack = (isNew = false) => {
    if (newStack) {
      const stackToAdd = availableStacks.find(
        (stack) => stack.value === newStack
      );
      if (!stackToAdd) return;

      if (isNew) {
        setNewProject((prev) => ({
          ...prev,
          techStack: [...prev.techStack, stackToAdd],
        }));
      } else {
        setEditingProject((prev) => ({
          ...prev,
          techStack: [...prev.techStack, stackToAdd],
        }));
      }
      setNewStack("");
    }
  };

  const handleRemoveStack = (index, isNew = false) => {
    if (isNew) {
      setNewProject((prev) => ({
        ...prev,
        techStack: prev.techStack.filter((_, i) => i !== index),
      }));
    } else {
      setEditingProject((prev) => ({
        ...prev,
        techStack: prev.techStack.filter((_, i) => i !== index),
      }));
    }
  };

  // --- Core CRUD Functions ---
  const handleEdit = (project) => {
    setIsEditing(true);
    setEditingProject({ ...project });
    setBackgroundImagePreview(project.backgroundImage || null);
    setProjectImagesPreviews(project.images || []);
    setBackgroundImageFile(null);
    setProjectImagesFiles([]);
    setError("");
    setSuccess("");
  };

  const handleSaveEdit = async () => {
    if (!editingProject.title.trim() || !editingProject.description.trim()) {
      setError("Title and description are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let backgroundImageUrl = editingProject.backgroundImage;
      let projectImagesUrls = editingProject.images || [];

      // Upload new background image if selected
      if (backgroundImageFile) {
        const uploadResult = await uploadToCloudinary(backgroundImageFile);
        backgroundImageUrl = uploadResult.url;
      }

      // Upload new project images if selected
      if (projectImagesFiles.length > 0) {
        const uploadedImages = [];
        for (let file of projectImagesFiles) {
          const uploadResult = await uploadToCloudinary(file);
          uploadedImages.push(uploadResult.url);
        }
        projectImagesUrls = uploadedImages;
      }

      const projectData = {
        ...editingProject,
        backgroundImage: backgroundImageUrl,
        images: projectImagesUrls,
      };

      const response = await updateProject(editingProject.id, projectData);
      const updatedProject = response.project;

      setProjects((prev) =>
        prev.map((project) =>
          project.id === editingProject.id ? updatedProject : project
        )
      );

      setSuccess("Project updated successfully!");
      setIsEditing(false);
      setEditingProject(null);
      setBackgroundImageFile(null);
      setBackgroundImagePreview(null);
      setProjectImagesFiles([]);
      setProjectImagesPreviews([]);
    } catch (error) {
      setError(error.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProject(null);
    setBackgroundImageFile(null);
    setBackgroundImagePreview(null);
    setProjectImagesFiles([]);
    setProjectImagesPreviews([]);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
      setSuccess("Project deleted successfully!");
    } catch (error) {
      setError(error.message || "Failed to delete project");
    }
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setNewProject({
      title: "",
      description: "",
      detailedDescription: "",
      category: [],
      images: [],
      backgroundImage: "",
      liveLink: "",
      githubLink: "",
      techStack: [],
      features: [],
      challenges: [],
      solutions: [],
      status: "Planned",
      timeline: "",
      teamSize: 1,
    });
    setBackgroundImageFile(null);
    setBackgroundImagePreview(null);
    setProjectImagesFiles([]);
    setProjectImagesPreviews([]);
    setError("");
    setSuccess("");
  };

  const handleSaveNew = async () => {
    if (!newProject.title.trim() || !newProject.description.trim()) {
      setError("Title and description are required");
      return;
    }

    if (!backgroundImageFile) {
      setError("Please select a background image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Upload background image to Cloudinary
      const backgroundUploadResult = await uploadToCloudinary(
        backgroundImageFile
      );

      // Upload project images to Cloudinary
      const projectImagesUrls = [];
      for (let file of projectImagesFiles) {
        const uploadResult = await uploadToCloudinary(file);
        projectImagesUrls.push(uploadResult.url);
      }

      const projectData = {
        ...newProject,
        backgroundImage: backgroundUploadResult.url,
        images: projectImagesUrls,
      };

      const createdProject = await createProject(projectData);

      setProjects((prev) => [...prev, createdProject]);
      setSuccess("Project added successfully!");
      setIsAdding(false);
      setNewProject({
        title: "",
        description: "",
        detailedDescription: "",
        category: [],
        images: [],
        backgroundImage: "",
        liveLink: "",
        githubLink: "",
        techStack: [],
        features: [],
        challenges: [],
        solutions: [],
        status: "Planned",
        timeline: "",
        teamSize: 1,
      });
      setBackgroundImageFile(null);
      setBackgroundImagePreview(null);
      setProjectImagesFiles([]);
      setProjectImagesPreviews([]);
    } catch (error) {
      setError(error.message || "Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewProject({
      title: "",
      description: "",
      detailedDescription: "",
      category: [],
      images: [],
      backgroundImage: "",
      liveLink: "",
      githubLink: "",
      techStack: [],
      features: [],
      challenges: [],
      solutions: [],
      status: "Planned",
      timeline: "",
      teamSize: 1,
    });
    setBackgroundImageFile(null);
    setBackgroundImagePreview(null);
    setProjectImagesFiles([]);
    setProjectImagesPreviews([]);
    setError("");
    setSuccess("");
  };

  const handleViewDetails = (project) => {
    setViewingProject(project);
  };

  const handleCloseDetails = () => {
    setViewingProject(null);
  };

  // Load projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Projects Management</h1>
        <button
          className={styles.addButton}
          onClick={handleAddNew}
          disabled={isEditing || isAdding}
        >
          <FiPlus /> Add Project
        </button>
      </div>

      {/* Success and Error Messages */}
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      {/* Projects Grid */}
      <div className={styles.projectsGrid}>
        {projects.map((project) => (
          <div key={project.id} className={styles.projectCard}>
            <div
              className={styles.projectImage}
              style={{ backgroundImage: `url(${project.backgroundImage})` }}
            >
              {/* Display Stacks */}
              {project.techStack && project.techStack.length > 0 && (
                <div className={styles.techStack}>
                  {project.techStack.map((stack, index) => (
                    <span
                      className={styles.techIcon}
                      key={index}
                      title={stack.name}
                    >
                      {renderIcon(stack.value || stack.name)}
                    </span>
                  ))}
                </div>
              )}
              {!project.backgroundImage && (
                <div className={styles.placeholderImage}>
                  <FiImage />
                </div>
              )}
              <div className={styles.cardOverlay}>
                <div className={styles.cardActions}>
                  <button
                    className={styles.viewBtn}
                    onClick={() => handleViewDetails(project)}
                  >
                    <FiEye />
                  </button>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit(project)}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(project.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <div className={styles.projectLinks}>
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      className={styles.visitLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiExternalLink /> Live Site
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      className={styles.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiGithub /> Code
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.projectHeader}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <span
                  className={`${styles.status} ${
                    styles[project.status.toLowerCase().replace(" ", "-")]
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className={styles.projectDescription}>{project.description}</p>
              <div className={styles.projectMeta}>
                {project.category.map((cat, index) => (
                  <span key={index} className={styles.categoryTag}>
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Details Modal */}
      {viewingProject && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.detailsModal}`}>
            <div className={styles.modalHeader}>
              <h2>{viewingProject.title}</h2>
              <button onClick={handleCloseDetails} className={styles.closeBtn}>
                <FiX />
              </button>
            </div>

            <div className={styles.detailsContent}>
              <div className={styles.detailsMain}>
                <div className={styles.detailsImage}>
                  <img
                    src={viewingProject.backgroundImage}
                    alt={viewingProject.title}
                  />
                </div>

                <div className={styles.detailsInfo}>
                  <div className={styles.infoSection}>
                    <h3>Description</h3>
                    <p>
                      {viewingProject.detailedDescription ||
                        viewingProject.description}
                    </p>
                  </div>

                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <strong>Status:</strong>
                      <span
                        className={`${styles.status} ${
                          styles[
                            viewingProject.status
                              .toLowerCase()
                              .replace(" ", "-")
                          ]
                        }`}
                      >
                        {viewingProject.status}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <strong>Timeline:</strong>
                      <span>{viewingProject.timeline}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <strong>Team Size:</strong>
                      <span>{viewingProject.teamSize} people</span>
                    </div>
                  </div>

                  <div className={styles.infoSection}>
                    <h3>Categories</h3>
                    <div className={styles.categories}>
                      {viewingProject.category.map((cat, index) => (
                        <span key={index} className={styles.categoryTag}>
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.infoSection}>
                    <h3>Project Images</h3>
                    <div className={styles.projectImagesGrid}>
                      {viewingProject.images &&
                        viewingProject.images.map((image, index) => (
                          <div key={index} className={styles.projectImageThumb}>
                            <img
                              src={image}
                              alt={`${viewingProject.title} screenshot ${
                                index + 1
                              }`}
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className={styles.infoSection}>
                    <h3>Tech Stack</h3>
                    <div className={styles.techStackDetails}>
                      {viewingProject.techStack.map((stack, index) => (
                        <div key={index} className={styles.techItem}>
                              <span className={styles.techIcon}>
                                {renderIcon(stack.value || stack.name)}
                              </span>
                              <span>{stack.name}</span>
                          <span className={styles.techCategory}>
                            ({stack.category})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.detailsSidebar}>
                <div className={styles.infoSection}>
                  <h3>Features</h3>
                  <ul>
                    {viewingProject.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.infoSection}>
                  <h3>Challenges</h3>
                  <ul>
                    {viewingProject.challenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.infoSection}>
                  <h3>Solutions</h3>
                  <ul>
                    {viewingProject.solutions.map((solution, index) => (
                      <li key={index}>{solution}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.projectLinks}>
                  {viewingProject.liveLink && (
                    <a
                      href={viewingProject.liveLink}
                      className={styles.visitLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiExternalLink /> Visit Live Site
                    </a>
                  )}
                  {viewingProject.githubLink && (
                    <a
                      href={viewingProject.githubLink}
                      className={styles.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiGithub /> View on GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && editingProject && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.wideModal}`}>
            <h2>Edit Project</h2>
            <div className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Project Title:</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter project title"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Status:</label>
                  <FlexibleSelect
                    options={statusOptions}
                    value={editingProject.status}
                    onChange={(e) =>
                      setEditingProject((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    placeholder="Select Status"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Short Description:</label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows="2"
                  placeholder="Enter short description"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Detailed Description:</label>
                <textarea
                  value={editingProject.detailedDescription}
                  onChange={(e) =>
                    setEditingProject((prev) => ({
                      ...prev,
                      detailedDescription: e.target.value,
                    }))
                  }
                  rows="4"
                  placeholder="Enter detailed description"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Background Image (Card Display):</label>
                  <div className={styles.imageUploadSection}>
                    {(editingProject.backgroundImage ||
                      backgroundImagePreview) && (
                      <div
                        className={styles.imagePreview}
                        style={{
                          backgroundImage: `url(${
                            backgroundImagePreview ||
                            editingProject.backgroundImage
                          })`,
                        }}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBackgroundImageChange(e, false)}
                      className={styles.fileInput}
                      id="edit-background-image-upload"
                      ref={backgroundFileInputRef}
                    />
                    <label
                      htmlFor="edit-background-image-upload"
                      className={styles.uploadButton}
                    >
                      <FiImage />{" "}
                      {editingProject.backgroundImage
                        ? "Change Background Image"
                        : "Upload Background Image"}
                    </label>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Project Images (Up to 3):</label>
                  <div className={styles.imageUploadSection}>
                    <div className={styles.projectImagesPreviews}>
                      {projectImagesPreviews.map((preview, index) => (
                        <div key={index} className={styles.projectImagePreview}>
                          <img src={preview} alt={`Preview ${index + 1}`} />
                          <button
                            type="button"
                            onClick={() => removeProjectImage(index, false)}
                            className={styles.removeImageBtn}
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleProjectImagesChange(e, false)}
                      className={styles.fileInput}
                      id="edit-project-images-upload"
                      ref={projectImagesFileInputRef}
                    />
                    <label
                      htmlFor="edit-project-images-upload"
                      className={styles.uploadButton}
                    >
                      <FiImage /> Upload Project Images
                    </label>
                    <div className={styles.uploadHint}>
                      {projectImagesPreviews.length}/3 images selected
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Categories:</label>
                  <div className={styles.checkboxGroup}>
                    {categoryOptions.map((option) => (
                      <label
                        key={option.value}
                        className={styles.checkboxLabel}
                      >
                        <input
                          type="checkbox"
                          checked={editingProject.category.includes(
                            option.value
                          )}
                          onChange={() =>
                            handleCategoryChange(option.value, false)
                          }
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Team Size:</label>
                  <input
                    type="number"
                    value={editingProject.teamSize}
                    onChange={(e) =>
                      setEditingProject((prev) => ({
                        ...prev,
                        teamSize: parseInt(e.target.value) || 1,
                      }))
                    }
                    min="1"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Timeline:</label>
                  <input
                    type="text"
                    value={editingProject.timeline}
                    onChange={(e) =>
                      setEditingProject((prev) => ({
                        ...prev,
                        timeline: e.target.value,
                      }))
                    }
                    placeholder="e.g., 3 months"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Live Link:</label>
                  <input
                    type="text"
                    value={editingProject.liveLink}
                    onChange={(e) =>
                      setEditingProject((prev) => ({
                        ...prev,
                        liveLink: e.target.value,
                      }))
                    }
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>GitHub Link:</label>
                <input
                  type="text"
                  value={editingProject.githubLink}
                  onChange={(e) =>
                    setEditingProject((prev) => ({
                      ...prev,
                      githubLink: e.target.value,
                    }))
                  }
                  placeholder="https://github.com/user/repo"
                />
              </div>

              {/* Features Management */}
              <div className={styles.arrayManagement}>
                <h4>Features</h4>
                {editingProject.features.map((item, index) => (
                  <div key={index} className={styles.arrayItem}>
                    <span>{item}</span>
                    <button
                      onClick={() =>
                        handleRemoveFromArray("features", index, false)
                      }
                      className={styles.removeArrayBtn}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
                <div className={styles.addArrayItem}>
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Enter feature"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      handleAddToArray("features", newFeature, false)
                    }
                  />
                  <button
                    onClick={() =>
                      handleAddToArray("features", newFeature, false)
                    }
                    className={styles.addArrayBtn}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* Challenges Management */}
              <div className={styles.arrayManagement}>
                <h4>Challenges</h4>
                {editingProject.challenges.map((item, index) => (
                  <div key={index} className={styles.arrayItem}>
                    <span>{item}</span>
                    <button
                      onClick={() =>
                        handleRemoveFromArray("challenges", index, false)
                      }
                      className={styles.removeArrayBtn}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
                <div className={styles.addArrayItem}>
                  <input
                    type="text"
                    value={newChallenge}
                    onChange={(e) => setNewChallenge(e.target.value)}
                    placeholder="Enter challenge"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      handleAddToArray("challenges", newChallenge, false)
                    }
                  />
                  <button
                    onClick={() =>
                      handleAddToArray("challenges", newChallenge, false)
                    }
                    className={styles.addArrayBtn}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* Solutions Management */}
              <div className={styles.arrayManagement}>
                <h4>Solutions</h4>
                {editingProject.solutions.map((item, index) => (
                  <div key={index} className={styles.arrayItem}>
                    <span>{item}</span>
                    <button
                      onClick={() =>
                        handleRemoveFromArray("solutions", index, false)
                      }
                      className={styles.removeArrayBtn}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
                <div className={styles.addArrayItem}>
                  <input
                    type="text"
                    value={newSolution}
                    onChange={(e) => setNewSolution(e.target.value)}
                    placeholder="Enter solution"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      handleAddToArray("solutions", newSolution, false)
                    }
                  />
                  <button
                    onClick={() =>
                      handleAddToArray("solutions", newSolution, false)
                    }
                    className={styles.addArrayBtn}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* Tech Stack Management */}
              <div className={styles.stacksManagement}>
                <h4>Technology Stacks</h4>
                {editingProject.techStack.map((stack, index) => (
                  <div key={index} className={styles.stackItem}>
                    <span>
                      {renderIcon(stack.value)} {stack.name} ({stack.category})
                    </span>
                    <button
                      onClick={() => handleRemoveStack(index, false)}
                      className={styles.removeStackBtn}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
                <div className={styles.addStack}>
                  <FlexibleSelect
                    options={availableStacks.map((stack) => ({
                      value: stack.value,
                      label: `${stack.name} (${stack.category})`,
                    }))}
                    value={newStack}
                    onChange={(e) => setNewStack(e.target.value)}
                    placeholder="Select Stack"
                  />
                  <button
                    onClick={() => handleAddStack(false)}
                    className={styles.addStackBtn}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={handleSaveEdit}
                  className={styles.saveBtn}
                  disabled={loading}
                >
                  <FiSave /> {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={styles.cancelBtn}
                  disabled={loading}
                >
                  <FiX /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Project Modal */}
      {isAdding && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.wideModal}`}>
            <h2>Add New Project</h2>
            <div className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Project Title:</label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter project title"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Status:</label>
                  <FlexibleSelect
                    options={statusOptions}
                    value={newProject.status}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    placeholder="Select Status"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Short Description:</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows="2"
                  placeholder="Enter short description"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Detailed Description:</label>
                <textarea
                  value={newProject.detailedDescription}
                  onChange={(e) =>
                    setNewProject((prev) => ({
                      ...prev,
                      detailedDescription: e.target.value,
                    }))
                  }
                  rows="4"
                  placeholder="Enter detailed description"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Background Image (Card Display):</label>
                  <div className={styles.imageUploadSection}>
                    {backgroundImagePreview && (
                      <div
                        className={styles.imagePreview}
                        style={{
                          backgroundImage: `url(${backgroundImagePreview})`,
                        }}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBackgroundImageChange(e, true)}
                      className={styles.fileInput}
                      id="new-background-image-upload"
                      ref={backgroundFileInputRef}
                    />
                    <label
                      htmlFor="new-background-image-upload"
                      className={styles.uploadButton}
                    >
                      <FiImage /> Upload Background Image
                    </label>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Project Images (Up to 3):</label>
                  <div className={styles.imageUploadSection}>
                    <div className={styles.projectImagesPreviews}>
                      {projectImagesPreviews.map((preview, index) => (
                        <div key={index} className={styles.projectImagePreview}>
                          <img src={preview} alt={`Preview ${index + 1}`} />
                          <button
                            type="button"
                            onClick={() => removeProjectImage(index, true)}
                            className={styles.removeImageBtn}
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleProjectImagesChange(e, true)}
                      className={styles.fileInput}
                      id="new-project-images-upload"
                      ref={projectImagesFileInputRef}
                    />
                    <label
                      htmlFor="new-project-images-upload"
                      className={styles.uploadButton}
                    >
                      <FiImage /> Upload Project Images
                    </label>
                    <div className={styles.uploadHint}>
                      {projectImagesPreviews.length}/3 images selected
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Categories:</label>
                  <div className={styles.checkboxGroup}>
                    {categoryOptions.map((option) => (
                      <label
                        key={option.value}
                        className={styles.checkboxLabel}
                      >
                        <input
                          type="checkbox"
                          checked={newProject.category.includes(option.value)}
                          onChange={() =>
                            handleCategoryChange(option.value, true)
                          }
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Team Size:</label>
                  <input
                    type="number"
                    value={newProject.teamSize}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        teamSize: parseInt(e.target.value) || 1,
                      }))
                    }
                    min="1"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Timeline:</label>
                  <input
                    type="text"
                    value={newProject.timeline}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        timeline: e.target.value,
                      }))
                    }
                    placeholder="e.g., 3 months"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Live Link:</label>
                  <input
                    type="text"
                    value={newProject.liveLink}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        liveLink: e.target.value,
                      }))
                    }
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>GitHub Link:</label>
                <input
                  type="text"
                  value={newProject.githubLink}
                  onChange={(e) =>
                    setNewProject((prev) => ({
                      ...prev,
                      githubLink: e.target.value,
                    }))
                  }
                  placeholder="https://github.com/user/repo"
                />
              </div>

              {/* Features Management */}
              <div className={styles.arrayManagement}>
                <h4>Features</h4>
                {newProject.features.map((item, index) => (
                  <div key={index} className={styles.arrayItem}>
                    <span>{item}</span>
                    <button
                      onClick={() =>
                        handleRemoveFromArray("features", index, true)
                      }
                      className={styles.removeArrayBtn}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
                <div className={styles.addArrayItem}>
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Enter feature"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      handleAddToArray("features", newFeature, true)
                    }
                  />
                  <button
                    onClick={() =>
                      handleAddToArray("features", newFeature, true)
                    }
                    className={styles.addArrayBtn}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* Challenges Management */}
              <div className={styles.arrayManagement}>
                <h4>Challenges</h4>
                {newProject.challenges.map((item, index) => (
                  <div key={index} className={styles.arrayItem}>
                    <span>{item}</span>
                    <button
                      onClick={() =>
                        handleRemoveFromArray("challenges", index, true)
                      }
                      className={styles.removeArrayBtn}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
                <div className={styles.addArrayItem}>
                  <input
                    type="text"
                    value={newChallenge}
                    onChange={(e) => setNewChallenge(e.target.value)}
                    placeholder="Enter challenge"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      handleAddToArray("challenges", newChallenge, true)
                    }
                  />
                  <button
                    onClick={() =>
                      handleAddToArray("challenges", newChallenge, true)
                    }
                    className={styles.addArrayBtn}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* Solutions Management */}
              <div className={styles.arrayManagement}>
                <h4>Solutions</h4>
                {newProject.solutions.map((item, index) => (
                  <div key={index} className={styles.arrayItem}>
                    <span>{item}</span>
                    <button
                      onClick={() =>
                        handleRemoveFromArray("solutions", index, true)
                      }
                      className={styles.removeArrayBtn}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
                <div className={styles.addArrayItem}>
                  <input
                    type="text"
                    value={newSolution}
                    onChange={(e) => setNewSolution(e.target.value)}
                    placeholder="Enter solution"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      handleAddToArray("solutions", newSolution, true)
                    }
                  />
                  <button
                    onClick={() =>
                      handleAddToArray("solutions", newSolution, true)
                    }
                    className={styles.addArrayBtn}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* Tech Stack Management */}
              <div className={styles.stacksManagement}>
                <h4>Technology Stacks</h4>
                {newProject.techStack.map((stack, index) => (
                  <div key={index} className={styles.stackItem}>
                    <span>
                      {renderIcon(stack.value)} {stack.name} ({stack.category})
                    </span>
                    <button
                      onClick={() => handleRemoveStack(index, true)}
                      className={styles.removeStackBtn}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
                <div className={styles.addStack}>
                  <FlexibleSelect
                    options={availableStacks.map((stack) => ({
                      value: stack.value,
                      label: `${stack.name} (${stack.category})`,
                    }))}
                    value={newStack}
                    onChange={(e) => setNewStack(e.target.value)}
                    placeholder="Select Stack"
                  />
                  <button
                    onClick={() => handleAddStack(true)}
                    className={styles.addArrayBtn}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={handleSaveNew}
                  className={styles.saveBtn}
                  disabled={loading}
                >
                  <FiSave /> {loading ? "Adding..." : "Add Project"}
                </button>
                <button
                  onClick={handleCancelAdd}
                  className={styles.cancelBtn}
                  disabled={loading}
                >
                  <FiX /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
