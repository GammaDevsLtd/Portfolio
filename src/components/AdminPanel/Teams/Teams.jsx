"use client";
import React, { useState } from "react";
import styles from "./Teams.module.css";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiUser,
  FiLink2,
} from "react-icons/fi";
import { FiGlobe, FiMail } from "react-icons/fi";
import FlexibleSelect from "@/components/UI/FlexibleSelect/FlexibleSelect";

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

  // Available icons for social media
  const availableIcons = [
    { name: "LinkedIn", value: "FiLinkedin" },
    { name: "Twitter", value: "FiTwitter" },
    { name: "GitHub", value: "FiGithub" },
    { name: "Instagram", value: "FiInstagram" },
    { name: "Facebook", value: "FiFacebook" },
    { name: "Dribbble", value: "FiDribbble" },
    { name: "Behance", value: "FiBehance" },
    { name: "Globe", value: "FiGlobe" },
    { name: "Mail", value: "FiMail" },
  ];

  const handleEdit = (member) => {
    setIsEditing(true);
    setEditingMember({ ...member });
  };

  const handleSaveEdit = () => {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === editingMember.id ? editingMember : member
      )
    );
    setIsEditing(false);
    setEditingMember(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingMember(null);
  };

  const handleDelete = (id) => {
    setTeamMembers((prev) => prev.filter((member) => member.id !== id));
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
  };

  const handleSaveNew = () => {
    const memberToAdd = {
      ...newMember,
      id: Date.now(), // Simple ID generation
    };
    setTeamMembers((prev) => [...prev, memberToAdd]);
    setIsAdding(false);
    setNewMember({
      name: "",
      image: "",
      role: "",
      desc: "",
      link: "",
      socials: [],
    });
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
  };

  const handleAddSocial = (member, isNew = false) => {
    if (newSocial.platform && newSocial.url && newSocial.icon) {
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
    }
  };

  const handleRemoveSocial = (index, member, isNew = false) => {
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

  // Function to render icon based on string value
  const renderIcon = (iconName) => {
    const icons = {
      FiLinkedin: <FiUser />,
      FiTwitter: <FiUser />,
      FiGithub: <FiUser />,
      FiInstagram: <FiUser />,
      FiFacebook: <FiUser />,
      FiDribbble: <FiUser />,
      FiBehance: <FiUser />,
      FiGlobe: <FiGlobe />,
      FiMail: <FiMail />,
    };
    return icons[iconName] || <FiLink2 />;
  };

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

      {/* Team Members Grid */}
      <div className={styles.teamGrid}>
        {teamMembers.map((member) => (
          <div key={member.id} className={styles.teamCard}>
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

              {member.socials.length > 0 && (
                <div className={styles.socials}>
                  <h4>Social Links:</h4>
                  <div className={styles.socialIcons}>
                    {member.socials.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        className={styles.socialLink}
                        title={social.platform}
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
                />
              </div>

              <div className={styles.formGroup}>
                <label>Image URL:</label>
                <input
                  type="text"
                  value={editingMember.image}
                  onChange={(e) =>
                    setEditingMember((prev) => ({
                      ...prev,
                      image: e.target.value,
                    }))
                  }
                />
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
                />
              </div>

              {/* Social Media Management */}
              <div className={styles.socialsManagement}>
                <h4>Social Media Links</h4>
                {editingMember.socials.map((social, index) => (
                  <div key={index} className={styles.socialItem}>
                    <span>
                      {social.platform} - {social.url}
                    </span>
                    <button
                      onClick={() => handleRemoveSocial(index, editingMember)}
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
                      icon: icon.icon, // Make sure your availableIcons includes the icon component
                    }))}
                    value={newSocial.icon}
                    onChange={(e) =>
                      setNewSocial((prev) => ({
                        ...prev,
                        icon: e.target.value,
                      }))
                    }
                    name="icon"
                    placeholder="Select Icon"
                    variant="compact"
                    width="140px"
                    size="small"
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
                    onClick={() => handleAddSocial(editingMember)}
                    className={styles.addSocialBtn}
                  >
                    <FiPlus />
                  </button>
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

      {/* Add New Member Modal */}
      {isAdding && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Add New Team Member</h2>
            <div className={styles.form}>
              {/* Same form fields as edit modal */}
              <div className={styles.formGroup}>
                <label>Name:</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Image URL:</label>
                <input
                  type="text"
                  value={newMember.image}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, image: e.target.value }))
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Role:</label>
                <input
                  type="text"
                  value={newMember.role}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, role: e.target.value }))
                  }
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
                />
              </div>

              <div className={styles.modalActions}>
                <button onClick={handleSaveNew} className={styles.saveBtn}>
                  <FiSave /> Add Member
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

export default Teams;
