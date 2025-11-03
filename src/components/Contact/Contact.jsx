"use client";
import React from "react";
import { useState, useRef } from "react";
import styles from "./Contact.module.css";
import CustomSelect from "./CustomSelect";
import { FaPaperPlane, FaCheckCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import axios from "axios";

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;

const projectTypeOptions = [
  { value: "website", label: "Website Development" },
  { value: "app", label: "App Development" },
  { value: "consultancy", label: "Tech Consultancy" },
  { value: "branding", label: "Branding" },
  { value: "training", label: "Training" },
  { value: "maintenance", label: "Tech Maintenance" },
  { value: "other", label: "Other" },
];

const timelineOptions = [
  { value: "asap", label: "ASAP" },
  { value: "1-3", label: "1-3 months" },
  { value: "3-6", label: "3-6 months" },
  { value: "6+", label: "6+ months" },
  { value: "flexible", label: "Flexible" },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    description: "",
  });
  
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const fileInputRef = useRef(null);

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
        originalName: file.name,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error(`Failed to upload file: ${file.name}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      const validTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        setSubmitStatus({
          type: "error",
          message: `Invalid file type: ${file.name}. Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG.`
        });
        return false;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setSubmitStatus({
          type: "error",
          message: `File too large: ${file.name}. Maximum size is 10MB.`
        });
        return false;
      }
      
      return true;
    });

    // Create previews for images
    const imagePreviews = validFiles
      .filter(file => file.type.startsWith('image/'))
      .map(file => URL.createObjectURL(file));

    setFiles(prev => [...prev, ...validFiles]);
    setFilePreviews(prev => [...prev, ...imagePreviews]);
  };

  const removeFile = (index) => {
    // Revoke object URL for image previews to avoid memory leaks
    if (filePreviews[index]) {
      URL.revokeObjectURL(filePreviews[index]);
    }
    
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    // Fixed validation - removed duplicate conditions and incorrect logic
    if (!formData.name || !formData.email || !formData.description || !formData.projectType || !formData.timeline || !formData.budget) {
      setSubmitStatus({
        type: "error", 
        message: "Please fill in all required fields marked with *."
      });
      setLoading(false);
      return;
    } 

    try {
      // Upload files to Cloudinary first
      let uploadedFiles = [];
      if (files.length > 0) {
        setSubmitStatus({
          type: "info",
          message: `Uploading ${files.length} file(s)...`
        });

        for (let file of files) {
          const uploadResult = await uploadToCloudinary(file);
          uploadedFiles.push(uploadResult);
        }
      }

      // Submit form data with file URLs
      const submissionData = {
        ...formData,
        files: uploadedFiles
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      const result = await response.json();

      if(result.ok){
        setSubmitStatus({
          type: "success",
          message: "Thank you! Your project inquiry has been submitted successfully. We'll get back to you within 24 hours.",
        });
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectType: "",
        budget: "",
        timeline: "",
        description: "",
      });
      setFiles([]);
      setFilePreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message: error.message || "Sorry, there was an error submitting your request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear status message
  const clearStatus = () => {
    setSubmitStatus(null);
  };

  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      filePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [filePreviews]);

  return (
    <section className={styles.contactSection} id="contact">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Contact Us</h2>
          <p>What do you need? We are here for you.</p>
        </div>

        <div className={styles.contactContent}>
          <form className={styles.contactForm} onSubmit={handleSubmit}>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter your full name"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter your company name"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="projectType">Project Type *</label>
              <CustomSelect
                name="projectType"
                value={formData.projectType}
                onChange={(value) => handleSelectChange("projectType", value)}
                placeholder="What Type of Project?"
                options={projectTypeOptions}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="budget">Estimated Budget *</label>
              <input
                name="budget"
                type="text"
                value={formData.budget}
                onChange={handleChange}
                placeholder="What is your budget range?"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="timeline">Project Timeline *</label>
              <CustomSelect
                name="timeline"
                value={formData.timeline}
                onChange={(value) => handleSelectChange("timeline", value)}
                placeholder="Select Timeline"
                options={timelineOptions}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Project Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Please describe your project requirements, goals, and any specific features you need..."
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="files">Attach Files (Optional)</label>
              <div className={styles.fileInputWrapper}>
                <input
                  type="file"
                  id="files"
                  name="files"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  disabled={loading}
                  ref={fileInputRef}
                />
                <div className={styles.fileInputLabel}>
                  <FaPaperPlane />
                  <span>Choose files or drag & drop here</span>
                </div>
              </div>
              
              {/* File previews */}
              {files.length > 0 && (
                <div className={styles.filePreviews}>
                  {files.map((file, index) => (
                    <div key={index} className={styles.filePreview}>
                      {filePreviews[index] ? (
                        <div className={styles.imagePreview}>
                          <img src={filePreviews[index]} alt={file.name} />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className={styles.removeFileBtn}
                            disabled={loading}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className={styles.fileInfo}>
                          <span>{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className={styles.removeFileBtn}
                            disabled={loading}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <small>
                Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB each)
              </small>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className={styles.loadingSpinner}></div>
                  {submitStatus?.type === "info" ? "Uploading Files..." : "Sending Request..."}
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Send Job Request
                </>
              )}
            </button>
            {submitStatus && (
              <div
                className={`${styles.statusMessage} ${
                  styles[submitStatus.type]
                }`}
              >
                <div className={styles.statusIcon}>
                  {submitStatus.type === "success" ? <FaCheckCircle /> : 
                   submitStatus.type === "info" ? <FaPaperPlane /> : 
                   <FaExclamationTriangle />}
                </div>
                <div className={styles.statusContent}>
                  <span>{submitStatus.message}</span>
                </div>
                <button
                  type="button"
                  className={styles.closeStatus}
                  onClick={clearStatus}
                >
                  ×
                </button>
              </div>
            )}
          </form>
          <div className={styles.contactInfo}>
            <h3>Get In Touch</h3>
            <div className={styles.infoItem}>
              <h4>Email</h4>
              <p>Gammadevs0@gmail.com</p>
            </div>
            <div className={styles.infoItem}>
              <h4>Phone</h4>
              <p>+234 808 0431 610</p>
            </div>
            <div className={styles.infoItem}>
              <h4>Location</h4>
              <p>
                Plot 429,
                <br />
                GRA Zone 6, Finima Bonny Island
              </p>
            </div>
            <div className={styles.infoItem}>
              <h4>Working Hours</h4>
              <p>
                Monday - Friday: 9:00 AM - 6:00 PM
                <br />
                Saturday: 10:00 AM - 2:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;