"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from "./form.module.css"

export default function FormPage() {
  const params = useParams();
  const formId = params.id;
  
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // In a real app, you'd fetch the form data from your API/database
    const fetchForm = async () => {
      // Simulate API call with enhanced form data
      const mockForm = {
        id: formId,
        title: "Customer Feedback Form",
        description: "Collect feedback from our customers",
        fields: [
          { id: '1', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
          { id: '2', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email' },
          { id: '3', type: 'textarea', label: 'Feedback', required: false, placeholder: 'Share your feedback' },
          { id: '4', type: 'dropdown', label: 'Rating', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'], placeholder: 'Select rating' },
          { id: '5', type: 'date', label: 'Visit Date', required: false, placeholder: 'Select date' },
          { id: '6', type: 'file', label: 'Attachment', required: false, placeholder: 'Upload file' }
        ]
      };
      setForm(mockForm);
      
      // Initialize form data
      const initialData = {};
      mockForm.fields.forEach(field => {
        initialData[field.id] = field.type === 'checkbox' ? false : '';
      });
      setFormData(initialData);
    };

    fetchForm();
  }, [formId]);

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleFileChange = (fieldId, files) => {
    // For file uploads, you would typically upload to a server
    // Here we just store the file names for demo
    const fileNames = Array.from(files).map(file => file.name).join(', ');
    setFormData(prev => ({
      ...prev,
      [fieldId]: fileNames
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    const requiredFields = form.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => {
      const value = formData[field.id];
      return !value || (typeof value === 'string' && !value.trim());
    });

    if (missingFields.length > 0) {
      alert('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    // Submit form data
    try {
      // In a real app, you'd send this to your backend
      console.log('Form submission:', {
        formId,
        formData,
        submittedAt: new Date().toISOString()
      });
      
      // Here you would actually save the submission to your database
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              minHeight: '100px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        );
      
      case 'dropdown':
        return (
          <select
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontFamily: 'inherit'
            }}
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={formData[field.id] || false}
            onChange={(e) => handleInputChange(field.id, e.target.checked)}
            style={{
              transform: 'scale(1.2)',
              marginRight: '0.5rem'
            }}
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontFamily: 'inherit'
            }}
          />
        );
      
      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => handleFileChange(field.id, e.target.files)}
            multiple
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontFamily: 'inherit'
            }}
          />
        );
      
      default:
        return (
          <input
            type={field.type}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontFamily: 'inherit'
            }}
          />
        );
    }
  };

  if (!form) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading form...</div>;
  }

  if (isSubmitted) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: '#083365', marginBottom: '1rem' }}>Thank You!</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>Your response has been recorded.</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            background: '#083365',
            color: 'white',
            padding: '0.75rem 2rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{form.title}</h1>
      {form.description && (
        <p className={styles.subtitle}>
          {form.description}
        </p>
      )}
      </div>
      
      <form onSubmit={handleSubmit} className={styles.contactForm}>
        {form.fields.map((field) => (
          <div key={field.id} style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#ffffffff' }}>
              {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
            </label>
            
            {renderField(field)}
          </div>
        ))}
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}