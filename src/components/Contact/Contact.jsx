"use client"
import React from "react"
import { useState } from 'react';
import styles from './Contact.module.css';
import CustomSelect from './CustomSelect';

const projectTypeOptions = [
  { value: 'website', label: 'Website Development' },
  { value: 'app', label: 'App Development' },
  { value: 'consultancy', label: 'Tech Consultancy' },
  { value: 'branding', label: 'Branding' },
  { value: 'training', label: 'Training' },
  { value: 'maintenance', label: 'Tech Maintenance' },
  { value: 'other', label: 'Other' },
];

// const budgetOptions = [
//   { value: '1k-5k', label: '$1,000 - $5,000' },
//   { value: '5k-10k', label: '$5,000 - $10,000' },
//   { value: '10k-25k', label: '$10,000 - $25,000' },
//   { value: '25k-50k', label: '$25,000 - $50,000' },
//   { value: '50k+', label: '$50,000+' },
// ];

const timelineOptions = [
  { value: 'asap', label: 'ASAP' },
  { value: '1-3', label: '1-3 months' },
  { value: '3-6', label: '3-6 months' },
  { value: '6+', label: '6+ months' },
  { value: 'flexible', label: 'Flexible' },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    files: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You would typically send this to your backend
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
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="projectType">Project Type *</label>
                <CustomSelect
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="What Type of Project?"
                  options={projectTypeOptions}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="budget">Estimated Budget *</label>
                <input
                  name="budget"
                  type="text"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="What is Budget Range"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="timeline">Project Timeline *</label>
              <CustomSelect
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                placeholder="Select Timeline"
                options={timelineOptions}
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
              />
              <small>Supported formats: PDF, DOC, JPG, PNG (Max 10MB each)</small>
            </div>

            <button type="submit" className={styles.submitButton}>
              Send Job Request
            </button>
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
              <p>Plot 429,<br />GRA Zone 6, Finima Bonny Island</p>
            </div>
            <div className={styles.infoItem}>
              <h4>Working Hours</h4>
              <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 2:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;