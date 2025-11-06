"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "./form.module.css";

export default function FormPage() {
  const params = useParams();
  const [formId, setFormId] = useState(null);

  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get formId from params when it's available
  useEffect(() => {
    if (params?.id) {
      setFormId(params.id);
    }
  }, [params]);

  // Fetch form data from API when formId is available
  useEffect(() => {
    const fetchForm = async () => {
      if (!formId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/forms/${formId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Form not found");
          }
          throw new Error("Failed to fetch form");
        }

        const formData = await response.json();

        // Validate that we got proper form data
        if (!formData || !formData.fields) {
          throw new Error("Invalid form data received");
        }

        setForm(formData);

        // Initialize form data with empty values
        const initialData = {};
        formData.fields.forEach((field) => {
          if (field.type === "checkbox") {
            initialData[field.id] = false;
          } else if (field.type === "file") {
            initialData[field.id] = null;
          } else {
            initialData[field.id] = "";
          }
        });
        setFormData(initialData);
      } catch (err) {
        console.error("Error fetching form:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleFileChange = (fieldId, files) => {
    // For file uploads, store the File objects for actual upload
    const fileList = Array.from(files);
    setFormData((prev) => ({
      ...prev,
      [fieldId]: fileList,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!form) return;
  
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

  try {
    // Submit to your submissions API
    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formId: formId,
        submissionData: formData,
        submittedAt: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit form');
    }

    const result = await response.json();
    console.log('Form submission successful:', result);
    
    setIsSubmitted(true);
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('There was an error submitting the form: ' + error.message);
  } finally {
    setIsSubmitting(false);
  }
};

  const renderField = (field) => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              minHeight: "100px",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
        );

      case "dropdown":
        return (
          <select
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontFamily: "inherit",
            }}
          >
            <option value="">{field.placeholder || "Select an option"}</option>
            {field.options &&
              field.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
          </select>
        );

      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={formData[field.id] || false}
            onChange={(e) => handleInputChange(field.id, e.target.checked)}
            style={{
              transform: "scale(1.2)",
              marginRight: "0.5rem",
            }}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontFamily: "inherit",
            }}
          />
        );

      case "file":
        return (
          <input
            type="file"
            onChange={(e) => handleFileChange(field.id, e.target.files)}
            multiple={field.multiple || false}
            accept={field.accept || "*"}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontFamily: "inherit",
            }}
          />
        );

      default:
        return (
          <input
            type={field.type}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontFamily: "inherit",
            }}
          />
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Loading form...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Form Not Found</h1>
          <p style={{ color: "#ff4444", margin: "1rem 0" }}>{error}</p>
          <p>
            The form you're looking for doesn't exist or may have been removed.
          </p>
        </div>
      </div>
    );
  }

  // Form not found state
  if (!form) {
    return (
      <div className={styles.container}>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Form Not Available</h1>
          <p>Unable to load the form. Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <h1 style={{ color: "#083365", marginBottom: "1rem" }}>Thank You!</h1>
          <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
            Your response has been recorded.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#083365",
              color: "white",
              padding: "0.75rem 2rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{form.title}</h1>
        {form.description && (
          <p className={styles.subtitle}>{form.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.contactForm}>
        {form.fields.map((field) => (
          <div key={field.id} style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
                color: "#ffffffff",
              }}
            >
              {field.label}{" "}
              {field.required && <span style={{ color: "red" }}>*</span>}
            </label>

            {renderField(field)}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
