"use client";
import React, { useState } from 'react';
import styles from './Projects.module.css';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiSave, 
  FiX,
  FiImage,
  FiExternalLink
} from 'react-icons/fi';

// Sample initial data matching your homepage
const initialProjects = [
  {
    id: 1,
    title: "Aces Voting",
    description: "A website focused on prompting users to vote for their favorite contestants.",
    backgroundImage: "/about.jpg",
    link: "#"
  },
  {
    id: 2,
    title: "Aces Voting",
    description: "A website focused on prompting users to vote for their favorite contestants.",
    backgroundImage: "/about.jpg",
    link: "#"
  },
  {
    id: 3,
    title: "Aces Voting",
    description: "A website focused on prompting users to vote for their favorite contestants.",
    backgroundImage: "/about.jpg",
    link: "#"
  },
  {
    id: 4,
    title: "Aces Voting",
    description: "A website focused on prompting users to vote for their favorite contestants.",
    backgroundImage: "/about.jpg",
    link: "#"
  }
];

const Projects = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    backgroundImage: "",
    link: ""
  });

  const handleEdit = (project) => {
    setIsEditing(true);
    setEditingProject({ ...project });
  };

  const handleSaveEdit = () => {
    setProjects(prev => 
      prev.map(project => 
        project.id === editingProject.id ? editingProject : project
      )
    );
    setIsEditing(false);
    setEditingProject(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProject(null);
  };

  const handleDelete = (id) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setNewProject({
      title: "",
      description: "",
      backgroundImage: "",
      link: ""
    });
  };

  const handleSaveNew = () => {
    const projectToAdd = {
      ...newProject,
      id: Date.now() // Simple ID generation
    };
    setProjects(prev => [...prev, projectToAdd]);
    setIsAdding(false);
    setNewProject({
      title: "",
      description: "",
      backgroundImage: "",
      link: ""
    });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewProject({
      title: "",
      description: "",
      backgroundImage: "",
      link: ""
    });
  };

  const handleImageUpload = (event, isNew = false) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you'd upload to a server and get back a URL
      // For now, we'll create a local object URL
      const imageUrl = URL.createObjectURL(file);
      
      if (isNew) {
        setNewProject(prev => ({ ...prev, backgroundImage: imageUrl }));
      } else {
        setEditingProject(prev => ({ ...prev, backgroundImage: imageUrl }));
      }
    }
  };

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

      {/* Projects Grid */}
      <div className={styles.projectsGrid}>
        {projects.map((project) => (
          <div key={project.id} className={styles.projectCard}>
            <div 
              className={styles.projectImage}
              style={{ backgroundImage: `url(${project.backgroundImage})` }}
            >
              {!project.backgroundImage && (
                <div className={styles.placeholderImage}>
                  <FiImage />
                </div>
              )}
              <div className={styles.cardOverlay}>
                <div className={styles.cardActions}>
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
                <a href={project.link} className={styles.visitLink} target="_blank" rel="noopener noreferrer">
                  <FiExternalLink /> Visit Site
                </a>
              </div>
            </div>
            
            <div className={styles.cardContent}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing && editingProject && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit Project</h2>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>Project Title:</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  placeholder="Enter project description"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Project Link:</label>
                <input
                  type="text"
                  value={editingProject.link}
                  onChange={(e) => setEditingProject(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Background Image:</label>
                <div className={styles.imageUploadSection}>
                  {editingProject.backgroundImage && (
                    <div 
                      className={styles.imagePreview}
                      style={{ backgroundImage: `url(${editingProject.backgroundImage})` }}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className={styles.fileInput}
                    id="edit-image-upload"
                  />
                  <label htmlFor="edit-image-upload" className={styles.uploadButton}>
                    <FiImage /> {editingProject.backgroundImage ? 'Change Image' : 'Upload Image'}
                  </label>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button onClick={handleSaveEdit} className={styles.saveBtn}>
                  <FiSave /> Save Changes
                </button>
                <button onClick={handleCancelEdit} className={styles.cancelBtn}>
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
          <div className={styles.modal}>
            <h2>Add New Project</h2>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>Project Title:</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  placeholder="Enter project description"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Project Link:</label>
                <input
                  type="text"
                  value={newProject.link}
                  onChange={(e) => setNewProject(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Background Image:</label>
                <div className={styles.imageUploadSection}>
                  {newProject.backgroundImage && (
                    <div 
                      className={styles.imagePreview}
                      style={{ backgroundImage: `url(${newProject.backgroundImage})` }}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className={styles.fileInput}
                    id="new-image-upload"
                  />
                  <label htmlFor="new-image-upload" className={styles.uploadButton}>
                    <FiImage /> {newProject.backgroundImage ? 'Change Image' : 'Upload Image'}
                  </label>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button onClick={handleSaveNew} className={styles.saveBtn}>
                  <FiSave /> Add Project
                </button>
                <button onClick={handleCancelAdd} className={styles.cancelBtn}>
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