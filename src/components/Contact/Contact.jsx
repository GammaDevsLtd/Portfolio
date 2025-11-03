"use client";
import React from "react";
import { useState } from "react";
import styles from "./Contact.module.css";
import CustomSelect from "./CustomSelect";

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
    files: null,
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    if(!formData.name || !formData.email || !formData.description || !formData.projectType || !formData.timeline || formData.budget || !formData.timeline || formData.company || !formData.phone) {
      setSubmitStatus({
        type: "error", 
        message: "Please fill in all required fields marked with *."
      });
      setLoading(false);
      return;
    } 

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      const result = await response.json();

      if(result.ok){
        setSubmitStatus({
        type: "success",
        message:
          "Thank you! Your project inquiry has been submitted successfully. We'll get back to you within 24 hours.",
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
        files: null,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message:
          error.message ||
          "Sorry, there was an error submitting your request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear status message
  const clearStatus = () => {
    setSubmitStatus(null);
  };

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
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, projectType: value }))
                }
                placeholder="What Type of Project?"
                options={projectTypeOptions}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="timeline">Project Timeline *</label>
              <CustomSelect
                name="timeline"
                value={formData.timeline}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, timeline: value }))
                }
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
              <input
                type="file"
                id="files"
                name="files"
                onChange={handleChange}
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                disabled={loading}
              />
              <small>
                Supported formats: PDF, DOC, JPG, PNG (Max 10MB each)
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
                  Sending Request...
                </>
              ) : (
                "Send Job Request"
              )}
            </button>
            {submitStatus && (
              <div
                className={`${styles.statusMessage} ${
                  styles[submitStatus.type]
                }`}
                onClick={clearStatus}
              >
                <span>{submitStatus.message}</span>
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
