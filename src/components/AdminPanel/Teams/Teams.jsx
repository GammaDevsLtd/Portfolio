"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Teams.module.css";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiUser,
  FiLink2,
  FiGlobe,
  FiMail,
  FiLinkedin,
  FiTwitter,
  FiGithub,
  FiInstagram,
  FiFacebook,
  FiDribbble,
} from "react-icons/fi";
import { FaBehance } from "react-icons/fa";
import FlexibleSelect from "@/components/UI/FlexibleSelect/FlexibleSelect";
import axios from "axios";

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;

// Sample initial data
const initialTeamMembers = [
  {
    id: 1,
    name: "George-Pepple Treasure",
    image: "/about.jpg",
    role: "Co-Founder & Full-Stack Developer",
    desc: "A passionate developer with a knack for creating seamless user experiences and robust, scalable backend solutions.",
    link: "#",
    socials: [
      { platform: "LinkedIn", url: "#", icon: "FiLinkedin" },
      { platform: "Twitter", url: "#", icon: "FiTwitter" },
    ],
  },
];

// Available icons for social media
const availableIcons = [
  { name: "LinkedIn", value: "FiLinkedin" },
  { name: "Twitter", value: "FiTwitter" },
  { name: "GitHub", value: "FiGithub" },
  { name: "Instagram", value: "FiInstagram" },
  { name: "Facebook", value: "FiFacebook" },
  { name: "Dribbble", value: "FiDribbble" },
  { name: "Behance", value: "FaBehance" },
  { name: "Globe", value: "FiGlobe" },
  { name: "Mail", value: "FiMail" },
];

const Teams = () => {
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    image: "",
    role: "",
    desc: "",
    link: "",
    socials: [],
  });
  const [newSocial, setNewSocial] = useState({
    platform: "",
    url: "",
    icon: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  // Function to render icon based on string value
  const renderIcon = (iconName) => {
    const icons = {
      FiLinkedin: <FiLinkedin />,
      FiTwitter: <FiTwitter />,
      FiGithub: <FiGithub />,
      FiInstagram: <FiInstagram />,
      FiFacebook: <FiFacebook />,
      FiDribbble: <FiDribbble />,
      FaBehance: <FaBehance />,
      FiGlobe: <FiGlobe />,
      FiMail: <FiMail />,
    };
    return icons[iconName] || <FiLink2 />;
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

  // Handle image file selection
  const handleImageChange = (e, isNew = false) => {
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

    setImageFile(file);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Update the appropriate state
    if (isNew) {
      setNewMember((prev) => ({ ...prev, image: previewUrl }));
    } else {
      setEditingMember((prev) => ({ ...prev, image: previewUrl }));
    }

    setError("");
  };

  // Clear preview when component unmounts or modals close
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // API functions
  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/teams");
      if (!response.ok) throw new Error("Failed to fetch team members");
      const data = await response.json();
      setTeamMembers(
        data.map((member) => ({
          ...member,
          id: member._id, // ✅ normalize ID for frontend use
        }))
      );
    } catch (error) {
      console.error("Error fetching team members:", error);
      setError("Failed to load team members");
    }
  };

  const createTeamMember = async (memberData) => {
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create team member");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating team member:", error);
      throw error;
    }
  };

  const updateTeamMember = async (id, memberData) => {
    try {
      const response = await fetch(`/api/teams/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update team member");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating team member:", error);
      throw error;
    }
  };

  const deleteTeamMember = async (id) => {
    try {
      const response = await fetch(`/api/teams`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete team member");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting team member:", error);
      throw error;
    }
  };

  // CRUD Operations
  const handleEdit = (member) => {
    setIsEditing(true);
    setEditingMember({ ...member });
    setImagePreview(member.image || null);
    setImageFile(null);
    setError("");
    setSuccess("");
  };

  const handleSaveEdit = async () => {
    if (!editingMember.name.trim() || !editingMember.role.trim()) {
      setError("Name and role are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let imageUrl = editingMember.image;

      // Upload new image if selected
      if (imageFile) {
        const uploadResult = await uploadToCloudinary(imageFile);
        imageUrl = uploadResult.url;
      }

      const memberData = {
        ...editingMember,
        image: imageUrl,
      };

      const updatedMember = await updateTeamMember(
        editingMember.id,
        memberData
      );

      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === editingMember.id ? updatedMember : member
        )
      );

      setSuccess("Team member updated successfully!");
      setIsEditing(false);
      setEditingMember(null);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      setError(error.message || "Failed to update team member");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingMember(null);
    setImageFile(null);
    setImagePreview(null);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      await deleteTeamMember(id);
      setTeamMembers((prev) => prev.filter((member) => member.id !== id));
      setSuccess("Team member deleted successfully!");
    } catch (error) {
      setError(error.message || "Failed to delete team member");
    }
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setNewMember({
      name: "",
      image: "",
      role: "",
      desc: "",
      link: "",
      socials: [],
    });
    setImageFile(null);
    setImagePreview(null);
    setError("");
    setSuccess("");
  };

  const handleSaveNew = async () => {
    if (!newMember.name.trim() || !newMember.role.trim()) {
      setError("Name and role are required");
      return;
    }

    if (!imageFile) {
      setError("Please select a profile image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Upload image to Cloudinary
      const uploadResult = await uploadToCloudinary(imageFile);

      const memberData = {
        ...newMember,
        image: uploadResult.url,
      };

      const createdMember = await createTeamMember(memberData);

      setTeamMembers((prev) => [...prev, createdMember]);
      setSuccess("Team member added successfully!");
      setIsAdding(false);
      setNewMember({
        name: "",
        image: "",
        role: "",
        desc: "",
        link: "",
        socials: [],
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      setError(error.message || "Failed to add team member");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewMember({
      name: "",
      image: "",
      role: "",
      desc: "",
      link: "",
      socials: [],
    });
    setImageFile(null);
    setImagePreview(null);
    setError("");
    setSuccess("");
  };

  // Social media management
  const handleAddSocial = (isNew = false) => {
    if (!newSocial.platform || !newSocial.url || !newSocial.icon) {
      setError("Please fill all social media fields");
      return;
    }

    const socialToAdd = { ...newSocial };

    if (isNew) {
      setNewMember((prev) => ({
        ...prev,
        socials: [...prev.socials, socialToAdd],
      }));
    } else {
      setEditingMember((prev) => ({
        ...prev,
        socials: [...prev.socials, socialToAdd],
      }));
    }

    setNewSocial({ platform: "", url: "", icon: "" });
    setError("");
  };

  const handleRemoveSocial = (index, isNew = false) => {
    if (isNew) {
      setNewMember((prev) => ({
        ...prev,
        socials: prev.socials.filter((_, i) => i !== index),
      }));
    } else {
      setEditingMember((prev) => ({
        ...prev,
        socials: prev.socials.filter((_, i) => i !== index),
      }));
    }
  };

  // Load team members on component mount
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Team Management</h1>
        <button
          className={styles.addButton}
          onClick={handleAddNew}
          disabled={isEditing || isAdding}
        >
          <FiPlus /> Add Team Member
        </button>
      </div>

      {/* Success and Error Messages */}
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      {/* Team Members Grid */}
      <div className={styles.teamGrid}>
        {teamMembers.map((member) => (
          <div key={member.id || member._id} className={styles.teamCard}>
            <div className={styles.cardHeader}>
              <div className={styles.memberImage}>
                {member.image ? (
                  <img src={member.image} alt={member.name} />
                ) : (
                  <FiUser className={styles.placeholderImage} />
                )}
              </div>
              <div className={styles.cardActions}>
                <button
                  className={styles.editBtn}
                  onClick={() => handleEdit(member)}
                >
                  <FiEdit />
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(member.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberRole}>{member.role}</p>
              <p className={styles.memberDesc}>{member.desc}</p>

              {member.link && (
                <a href={member.link} className={styles.portfolioLink}>
                  <FiLink2 /> Portfolio
                </a>
              )}

              {member.socials?.length > 0 && (
                <div className={styles.socials}>
                  <h4>Social Links:</h4>
                  <div className={styles.socialIcons}>
                    {member.socials.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        className={styles.socialLink}
                        title={social.platform}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {renderIcon(social.icon)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing && editingMember && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit Team Member</h2>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>Name:</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) =>
                    setEditingMember((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter full name"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Profile Image:</label>
                <div className={styles.imageUploadSection}>
                  {(editingMember.image || imagePreview) && (
                    <div
                      className={styles.imagePreview}
                      style={{
                        backgroundImage: `url(${
                          imagePreview || editingMember.image
                        })`,
                      }}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, false)}
                    className={styles.fileInput}
                    id="edit-image-upload"
                    ref={fileInputRef}
                  />
                  <label
                    htmlFor="edit-image-upload"
                    className={styles.uploadButton}
                  >
                    <FiUser />{" "}
                    {editingMember.image ? "Change Image" : "Upload Image"}
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Role:</label>
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={(e) =>
                    setEditingMember((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
                  }
                  placeholder="Enter role"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea
                  value={editingMember.desc}
                  onChange={(e) =>
                    setEditingMember((prev) => ({
                      ...prev,
                      desc: e.target.value,
                    }))
                  }
                  rows="3"
                  placeholder="Enter description"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Portfolio Link:</label>
                <input
                  type="text"
                  value={editingMember.link}
                  onChange={(e) =>
                    setEditingMember((prev) => ({
                      ...prev,
                      link: e.target.value,
                    }))
                  }
                  placeholder="https://portfolio.example.com"
                />
              </div>

              {/* Social Media Management */}
              <div className={styles.socialsManagement}>
                <h4>Social Media Links</h4>
                {editingMember.socials.map((social, index) => (
                  <div key={index} className={styles.socialItem}>
                    <span>
                      {renderIcon(social.icon)} {social.platform} - {social.url}
                    </span>
                    <button
                      onClick={() => handleRemoveSocial(index, false)}
                      className={styles.removeSocialBtn}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}

                <div className={styles.addSocial}>
                  <FlexibleSelect
                    options={availableIcons.map((icon) => ({
                      value: icon.value,
                      label: icon.name,
                    }))}
                    value={newSocial.icon}
                    onChange={(e) =>
                      setNewSocial((prev) => ({
                        ...prev,
                        icon: e.target.value,
                      }))
                    }
                    placeholder="Select Platform"
                  />
                  <input
                    type="text"
                    placeholder="Platform (e.g., LinkedIn)"
                    value={newSocial.platform}
                    onChange={(e) =>
                      setNewSocial((prev) => ({
                        ...prev,
                        platform: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="text"
                    placeholder="URL"
                    value={newSocial.url}
                    onChange={(e) =>
                      setNewSocial((prev) => ({ ...prev, url: e.target.value }))
                    }
                  />
                  <button
                    onClick={() => handleAddSocial(false)}
                    className={styles.addSocialBtn}
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

      {/* Add New Member Modal */}
      {isAdding && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Add New Team Member</h2>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>Name:</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter full name"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Profile Image:</label>
                <div className={styles.imageUploadSection}>
                  {imagePreview && (
                    <div
                      className={styles.imagePreview}
                      style={{
                        backgroundImage: `url(${imagePreview})`,
                      }}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, true)}
                    className={styles.fileInput}
                    id="new-image-upload"
                    ref={fileInputRef}
                  />
                  <label
                    htmlFor="new-image-upload"
                    className={styles.uploadButton}
                  >
                    <FiUser /> Upload Image
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Role:</label>
                <input
                  type="text"
                  value={newMember.role}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, role: e.target.value }))
                  }
                  placeholder="Enter role"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea
                  value={newMember.desc}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, desc: e.target.value }))
                  }
                  rows="3"
                  placeholder="Enter description"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Portfolio Link:</label>
                <input
                  type="text"
                  value={newMember.link}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, link: e.target.value }))
                  }
                  placeholder="https://portfolio.example.com"
                />
              </div>

              {/* Social Media Management for New Member */}
              <div className={styles.socialsManagement}>
                <h4>Social Media Links</h4>
                {newMember.socials.map((social, index) => (
                  <div key={index} className={styles.socialItem}>
                    <span>
                      {renderIcon(social.icon)} {social.platform} - {social.url}
                    </span>
                    <button
                      onClick={() => handleRemoveSocial(index, true)}
                      className={styles.removeSocialBtn}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}

                <div className={styles.addSocial}>
                  <FlexibleSelect
                    options={availableIcons.map((icon) => ({
                      value: icon.value,
                      label: icon.name,
                    }))}
                    value={newSocial.icon}
                    onChange={(e) =>
                      setNewSocial((prev) => ({
                        ...prev,
                        icon: e.target.value,
                      }))
                    }
                    placeholder="Select Platform"
                  />
                  <input
                    type="text"
                    placeholder="Platform (e.g., LinkedIn)"
                    value={newSocial.platform}
                    onChange={(e) =>
                      setNewSocial((prev) => ({
                        ...prev,
                        platform: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="text"
                    placeholder="URL"
                    value={newSocial.url}
                    onChange={(e) =>
                      setNewSocial((prev) => ({ ...prev, url: e.target.value }))
                    }
                  />
                  <button
                    onClick={() => handleAddSocial(true)}
                    className={styles.addSocialBtn}
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
                  <FiSave /> {loading ? "Adding..." : "Add Member"}
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

export default Teams;
