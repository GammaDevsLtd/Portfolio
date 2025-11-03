"use client";
import React from "react";
import { useState, useRef } from "react";
import styles from "./ContactPage.module.css";
import CustomSelect from "@/components/Contact/CustomSelect";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaCheckCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";
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

const ContactPage = () => {
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

    // Enhanced validation
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

      setSubmitStatus({
        type: "success",
        message: "Thank you! Your project inquiry has been submitted successfully. We'll get back to you within 24 hours.",
      });

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
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Get In Touch</h1>
          <p className={styles.heroSubtitle}>
            Ready to bring your ideas to life? Let's discuss your project and create something amazing together.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Project Completion</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>98%</span>
              <span className={styles.statLabel}>Client Satisfaction</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            {/* Contact Form */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <h2>Start Your Project</h2>
                <p>Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>

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

                <div className={styles.formRow}>
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
                    rows="6"
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
                  
                  <small>Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB each)</small>
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
                      Send Project Request
                    </>
                  )}
                </button>
                
                {submitStatus && (
                  <div className={`${styles.statusMessage} ${styles[submitStatus.type]}`}>
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
            </div>

            {/* Contact Info */}
            <div className={styles.infoSection}>
              <div className={styles.infoCard}>
                <h3>Let's Talk</h3>
                <p>We're here to help you bring your digital vision to life. Get in touch and let's start building something extraordinary.</p>
                
                <div className={styles.contactMethods}>
                  <div className={styles.contactMethod}>
                    <div className={styles.methodIcon}>
                      <FaEnvelope />
                    </div>
                    <div className={styles.methodInfo}>
                      <h4>Email Us</h4>
                      <p>Gammadevs0@gmail.com</p>
                      <span>We'll reply within 24 hours</span>
                    </div>
                  </div>

                  <div className={styles.contactMethod}>
                    <div className={styles.methodIcon}>
                      <FaPhone />
                    </div>
                    <div className={styles.methodInfo}>
                      <h4>Call Us</h4>
                      <p>+234 808 0431 610</p>
                      <span>Mon-Fri from 9am to 6pm</span>
                    </div>
                  </div>

                  <div className={styles.contactMethod}>
                    <div className={styles.methodIcon}>
                      <FaMapMarkerAlt />
                    </div>
                    <div className={styles.methodInfo}>
                      <h4>Visit Us</h4>
                      <p>
                        Plot 429, GRA Zone 6<br />
                        Finima Bonny Island
                      </p>
                    </div>
                  </div>

                  <div className={styles.contactMethod}>
                    <div className={styles.methodIcon}>
                      <FaClock />
                    </div>
                    <div className={styles.methodInfo}>
                      <h4>Working Hours</h4>
                      <p>
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 2:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.socialProof}>
                  <div className={styles.testimonial}>
                    <p>"GammaDevs has worked to give the best of tech to everyone involved. And with our clients always satisfied"</p>
                    <span>- Obeta Chukwuka, Co-Founder</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;