"use client";
import React, { useState, useEffect } from 'react';
import styles from './Forms.module.css';
import { 
  FiPlus, 
  FiTrash2, 
  FiSave, 
  FiX,
  FiLink,
  FiCopy,
  FiEye,
  FiEdit,
  FiFileText,
  FiCheckSquare,
  FiCalendar,
  FiDownload,
  FiBarChart2,
  FiUsers,
  FiChevronDown,
  FiUpload,
  FiCopy as FiDuplicate
} from 'react-icons/fi';
import { MdOutlineTextFields } from "react-icons/md";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import FlexibleSelect from '@/components/UI/FlexibleSelect/FlexibleSelect';

// Sample initial data with submissions
const initialForms = [
  {
    id: 'feedback-form-1',
    title: "Customer Feedback Form",
    description: "Collect feedback from our customers",
    fields: [
      { id: '1', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
      { id: '2', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email' },
      { id: '3', type: 'textarea', label: 'Feedback', required: false, placeholder: 'Share your feedback' },
      { id: '4', type: 'dropdown', label: 'Rating', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'], placeholder: 'Select rating' }
    ],
    createdAt: new Date('2024-01-15').toISOString(),
    submissions: [
      {
        id: 'sub-1',
        submittedAt: new Date('2024-01-20').toISOString(),
        data: {
          '1': 'John Doe',
          '2': 'john@example.com',
          '3': 'Great service!',
          '4': 'Excellent'
        }
      },
      {
        id: 'sub-2',
        submittedAt: new Date('2024-01-22').toISOString(),
        data: {
          '1': 'Jane Smith',
          '2': 'jane@example.com',
          '3': 'Could be better',
          '4': 'Average'
        }
      }
    ]
  }
];

const Forms = () => {
  const [forms, setForms] = useState(initialForms);
  const [isCreating, setIsCreating] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [viewingSubmissions, setViewingSubmissions] = useState(null);
  const [viewingAnalytics, setViewingAnalytics] = useState(null);
  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    fields: []
  });
  const [newField, setNewField] = useState({
    type: "text",
    label: "",
    required: false,
    placeholder: "",
    options: []
  });
  const [newOption, setNewOption] = useState("");

  // Enhanced field types
  const fieldTypes = [
    { value: 'text', label: 'Text Input', icon: <MdOutlineTextFields /> },
    { value: 'email', label: 'Email Input', icon: <MdOutlineTextFields /> },
    { value: 'number', label: 'Number Input', icon: <MdOutlineTextFields /> },
    { value: 'textarea', label: 'Text Area', icon: <FiFileText /> },
    { value: 'checkbox', label: 'Checkbox', icon: <FiCheckSquare /> },
    { value: 'date', label: 'Date Picker', icon: <FiCalendar /> },
    { value: 'dropdown', label: 'Dropdown', icon: <FiChevronDown /> },
    { value: 'file', label: 'File Upload', icon: <FiUpload /> }
  ];

  // Generate form link
  const generateFormLink = (formId) => {
    return `${window.location.origin}/forms/${formId}`;
  };

  // Copy form link to clipboard
  const copyToClipboard = (formId) => {
    const link = generateFormLink(formId);
    navigator.clipboard.writeText(link).then(() => {
      alert('Form link copied to clipboard!');
    });
  };

  // View form (opens in new tab)
  const viewForm = (formId) => {
    const link = generateFormLink(formId);
    window.open(link, '_blank');
  };

  // View submissions
  const handleViewSubmissions = (form) => {
    setViewingSubmissions(form);
  };

  // View analytics
  const handleViewAnalytics = (form) => {
    setViewingAnalytics(form);
  };

  // Duplicate form
  const handleDuplicateForm = (form) => {
    const duplicatedForm = {
      ...form,
      id: `form-${Date.now()}`,
      title: `${form.title} (Copy)`,
      createdAt: new Date().toISOString(),
      submissions: []
    };
    setForms(prev => [...prev, duplicatedForm]);
  };

  // Add option to dropdown field
  const handleAddOption = () => {
    if (newOption.trim()) {
      setNewField(prev => ({
        ...prev,
        options: [...prev.options, newOption.trim()]
      }));
      setNewOption("");
    }
  };

  // Remove option from dropdown field
  const handleRemoveOption = (optionIndex) => {
    setNewField(prev => ({
      ...prev,
      options: prev.options.filter((_, index) => index !== optionIndex)
    }));
  };

  // Add new field to form
  const handleAddField = () => {
    if (newField.label.trim()) {
      const fieldToAdd = {
        ...newField,
        id: `field-${Date.now()}`
      };

      if (editingForm) {
        setEditingForm(prev => ({
          ...prev,
          fields: [...prev.fields, fieldToAdd]
        }));
      } else {
        setNewForm(prev => ({
          ...prev,
          fields: [...prev.fields, fieldToAdd]
        }));
      }

      setNewField({
        type: "text",
        label: "",
        required: false,
        placeholder: "",
        options: []
      });
      setNewOption("");
    }
  };

  // Remove field from form
  const handleRemoveField = (fieldId) => {
    if (editingForm) {
      setEditingForm(prev => ({
        ...prev,
        fields: prev.fields.filter(field => field.id !== fieldId)
      }));
    } else {
      setNewForm(prev => ({
        ...prev,
        fields: prev.fields.filter(field => field.id !== fieldId)
      }));
    }
  };

  // Start creating new form
  const handleCreateNew = () => {
    setIsCreating(true);
    setNewForm({
      title: "",
      description: "",
      fields: []
    });
  };

  // Save new form
  const handleSaveNew = () => {
    if (newForm.title.trim() && newForm.fields.length > 0) {
      const formToAdd = {
        ...newForm,
        id: `form-${Date.now()}`,
        createdAt: new Date().toISOString(),
        submissions: []
      };
      setForms(prev => [...prev, formToAdd]);
      setIsCreating(false);
      setNewForm({
        title: "",
        description: "",
        fields: []
      });
    } else {
      alert('Please add a title and at least one field to your form.');
    }
  };

  // Start editing form
  const handleEdit = (form) => {
    setEditingForm({ ...form });
  };

  // Save edited form
  const handleSaveEdit = () => {
    if (editingForm.title.trim() && editingForm.fields.length > 0) {
      setForms(prev => 
        prev.map(form => 
          form.id === editingForm.id ? editingForm : form
        )
      );
      setEditingForm(null);
    } else {
      alert('Please add a title and at least one field to your form.');
    }
  };

  // Delete form
  const handleDelete = (formId) => {
    if (confirm('Are you sure you want to delete this form? All submissions will be lost.')) {
      setForms(prev => prev.filter(form => form.id !== formId));
    }
  };

  // Export submissions to CSV
  const exportToCSV = (form) => {
    if (!form.submissions || form.submissions.length === 0) {
      alert('No submissions to export.');
      return;
    }

    const headers = form.fields.map(field => field.label).join(',');
    const rows = form.submissions.map(submission => {
      return form.fields.map(field => {
        const value = submission.data[field.id] || '';
        // Escape commas and quotes for CSV
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',');
    }).join('\n');

    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title}-submissions.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export submissions to Excel
  const exportToExcel = (form) => {
    // For Excel export, you would typically use a library like xlsx
    // This is a simplified version that creates a CSV (which Excel can open)
    exportToCSV(form);
  };

  // Generate analytics data
  const generateAnalyticsData = (form) => {
    // Submission trends (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailySubmissions = last7Days.map(date => {
      const count = form.submissions.filter(sub => 
        sub.submittedAt.split('T')[0] === date
      ).length;
      return { date, submissions: count };
    });

    // Field completion rates
    const fieldCompletion = form.fields.map(field => {
      const total = form.submissions.length;
      const completed = form.submissions.filter(sub => 
        sub.data[field.id] && String(sub.data[field.id]).trim() !== ''
      ).length;
      const rate = total > 0 ? (completed / total) * 100 : 0;
      return { field: field.label, completion: Math.round(rate) };
    });

    // Dropdown option distribution (if any dropdown fields)
    const dropdownFields = form.fields.filter(field => field.type === 'dropdown');
    const optionDistribution = [];
    
    dropdownFields.forEach(field => {
      const distribution = {};
      form.submissions.forEach(sub => {
        const value = sub.data[field.id];
        if (value) {
          distribution[value] = (distribution[value] || 0) + 1;
        }
      });
      
      Object.entries(distribution).forEach(([option, count]) => {
        optionDistribution.push({
          name: `${field.label}: ${option}`,
          value: count
        });
      });
    });

    return {
      dailySubmissions,
      fieldCompletion,
      optionDistribution,
      totalSubmissions: form.submissions.length,
      averageCompletion: fieldCompletion.reduce((sum, field) => sum + field.completion, 0) / fieldCompletion.length
    };
  };

  // Cancel creation/editing
  const handleCancel = () => {
    setIsCreating(false);
    setEditingForm(null);
    setViewingSubmissions(null);
    setViewingAnalytics(null);
    setNewForm({
      title: "",
      description: "",
      fields: []
    });
  };

  // Colors for charts
  const COLORS = ['#32D0EB', '#6CE0F6', '#083365', '#0A0A0A', '#FF6B6B', '#4ECDC4'];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Forms Management</h1>
        <button 
          className={styles.addButton}
          onClick={handleCreateNew}
          disabled={isCreating || editingForm}
        >
          <FiPlus /> Create New Form
        </button>
      </div>

      {/* Forms Grid */}
      <div className={styles.formsGrid}>
        {forms.map((form) => (
          <div key={form.id} className={styles.formCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.formTitle}>{form.title}</h3>
              <div className={styles.cardActions}>
                <button 
                  className={styles.viewBtn}
                  onClick={() => viewForm(form.id)}
                  title="View Form"
                >
                  <FiEye />
                </button>
                <button 
                  className={styles.copyBtn}
                  onClick={() => copyToClipboard(form.id)}
                  title="Copy Form Link"
                >
                  <FiCopy />
                </button>
                <button 
                  className={styles.analyticsBtn}
                  onClick={() => handleViewAnalytics(form)}
                  title="View Analytics"
                >
                  <FiBarChart2 />
                </button>
                <button 
                  className={styles.submissionsBtn}
                  onClick={() => handleViewSubmissions(form)}
                  title="View Submissions"
                >
                  <FiUsers />
                </button>
                <button 
                  className={styles.duplicateBtn}
                  onClick={() => handleDuplicateForm(form)}
                  title="Duplicate Form"
                >
                  <FiDuplicate />
                </button>
                <button 
                  className={styles.editBtn}
                  onClick={() => handleEdit(form)}
                  title="Edit Form"
                >
                  <FiEdit />
                </button>
                <button 
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(form.id)}
                  title="Delete Form"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            
            <div className={styles.cardContent}>
              <p className={styles.formDescription}>{form.description}</p>
              
              <div className={styles.formMeta}>
                <span className={styles.fieldCount}>
                  {form.fields.length} field{form.fields.length !== 1 ? 's' : ''}
                </span>
                <span className={styles.submissionCount}>
                  {form.submissions.length} submission{form.submissions.length !== 1 ? 's' : ''}
                </span>
                <span className={styles.createdDate}>
                  {new Date(form.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className={styles.formLink}>
                <FiLink />
                <span className={styles.linkText}>
                  {generateFormLink(form.id)}
                </span>
              </div>

              <div className={styles.fieldsPreview}>
                <h4>Fields:</h4>
                <div className={styles.fieldsList}>
                  {form.fields.slice(0, 3).map((field, index) => (
                    <span key={field.id} className={styles.fieldTag}>
                      {field.label} {field.required && '*'}
                    </span>
                  ))}
                  {form.fields.length > 3 && (
                    <span className={styles.moreFields}>
                      +{form.fields.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(isCreating || editingForm) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{editingForm ? 'Edit Form' : 'Create New Form'}</h2>
            
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>Form Title *</label>
                <input
                  type="text"
                  value={editingForm ? editingForm.title : newForm.title}
                  onChange={(e) => 
                    editingForm 
                      ? setEditingForm(prev => ({ ...prev, title: e.target.value }))
                      : setNewForm(prev => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter form title"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={editingForm ? editingForm.description : newForm.description}
                  onChange={(e) =>
                    editingForm
                      ? setEditingForm(prev => ({ ...prev, description: e.target.value }))
                      : setNewForm(prev => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Enter form description"
                  rows="2"
                />
              </div>

              {/* Fields Management */}
              <div className={styles.fieldsSection}>
                <h3>Form Fields</h3>
                
                {/* Add New Field */}
<div className={styles.addField}>
  <div className={styles.fieldInputs}>
    <FlexibleSelect
      options={fieldTypes.map(type => ({
        value: type.value,
        label: type.label,
        icon: type.icon
      }))}
      value={newField.type}
      onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value }))}
      name="type"
      placeholder="Select field type"
      variant="compact"
      width="150px"
      size="small"
    />
    
    <input
      type="text"
      value={newField.label}
      onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
      placeholder="Field label"
    />
    
    <input
      type="text"
      value={newField.placeholder}
      onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
      placeholder="Placeholder text"
    />
    
    {/* ... rest of your form ... */}
  </div>
</div>

                {/* Fields List */}
                <div className={styles.fieldsList}>
                  <h4>Current Fields:</h4>
                  {(editingForm ? editingForm.fields : newForm.fields).length === 0 ? (
                    <p className={styles.noFields}>No fields added yet. Add your first field above.</p>
                  ) : (
                    (editingForm ? editingForm.fields : newForm.fields).map((field) => (
                      <div key={field.id} className={styles.fieldItem}>
                        <div className={styles.fieldInfo}>
                          <span className={styles.fieldType}>
                            {fieldTypes.find(t => t.value === field.type)?.icon}
                            {fieldTypes.find(t => t.value === field.type)?.label}
                            {field.type === 'dropdown' && ` (${field.options.length} options)`}
                          </span>
                          <span className={styles.fieldLabel}>
                            {field.label} {field.required && <span className={styles.requiredStar}>*</span>}
                          </span>
                          {field.placeholder && (
                            <span className={styles.fieldPlaceholder}>
                              "{field.placeholder}"
                            </span>
                          )}
                          {field.type === 'dropdown' && field.options.length > 0 && (
                            <div className={styles.fieldOptions}>
                              Options: {field.options.join(', ')}
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => handleRemoveField(field.id)}
                          className={styles.removeFieldBtn}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={styles.modalActions}>
                <button 
                  onClick={editingForm ? handleSaveEdit : handleSaveNew}
                  className={styles.saveBtn}
                  disabled={
                    (editingForm ? !editingForm.title.trim() : !newForm.title.trim()) ||
                    (editingForm ? editingForm.fields.length === 0 : newForm.fields.length === 0)
                  }
                >
                  <FiSave /> {editingForm ? 'Save Changes' : 'Create Form'}
                </button>
                <button onClick={handleCancel} className={styles.cancelBtn}>
                  <FiX /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {viewingSubmissions && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: '90vw', width: '90vw' }}>
            <div className={styles.modalHeader}>
              <h2>Submissions for {viewingSubmissions.title}</h2>
              <div className={styles.exportButtons}>
                <button 
                  onClick={() => exportToCSV(viewingSubmissions)}
                  className={styles.exportBtn}
                >
                  <FiDownload /> Export CSV
                </button>
                <button 
                  onClick={() => exportToExcel(viewingSubmissions)}
                  className={styles.exportBtn}
                >
                  <FiDownload /> Export Excel
                </button>
              </div>
            </div>
            
            {viewingSubmissions.submissions.length === 0 ? (
              <div className={styles.noSubmissions}>
                <p>No submissions yet.</p>
              </div>
            ) : (
              <div className={styles.submissionsTableContainer}>
                <table className={styles.submissionsTable}>
                  <thead>
                    <tr>
                      <th>Submitted At</th>
                      {viewingSubmissions.fields.map(field => (
                        <th key={field.id}>{field.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {viewingSubmissions.submissions.map((submission) => (
                      <tr key={submission.id}>
                        <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                        {viewingSubmissions.fields.map(field => (
                          <td key={field.id}>
                            {submission.data[field.id] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className={styles.modalActions}>
              <button onClick={() => setViewingSubmissions(null)} className={styles.cancelBtn}>
                <FiX /> Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {viewingAnalytics && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: '90vw', width: '90vw' }}>
            <h2>Analytics for {viewingAnalytics.title}</h2>
            
            {viewingAnalytics.submissions.length === 0 ? (
              <div className={styles.noSubmissions}>
                <p>No submissions yet. Analytics will appear here once you receive submissions.</p>
              </div>
            ) : (
              <div className={styles.analyticsGrid}>
                {/* Summary Cards */}
                <div className={styles.summaryCards}>
                  <div className={styles.summaryCard}>
                    <h3>Total Submissions</h3>
                    <p className={styles.summaryNumber}>{viewingAnalytics.submissions.length}</p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h3>Average Completion</h3>
                    <p className={styles.summaryNumber}>
                      {Math.round(generateAnalyticsData(viewingAnalytics).averageCompletion)}%
                    </p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h3>Last Submission</h3>
                    <p className={styles.summaryDate}>
                      {new Date(viewingAnalytics.submissions[viewingAnalytics.submissions.length - 1].submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Submission Trends */}
                <div className={styles.chartContainer}>
                  <h3>Submission Trends (Last 7 Days)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={generateAnalyticsData(viewingAnalytics).dailySubmissions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="submissions" fill="#32D0EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Field Completion Rates */}
                <div className={styles.chartContainer}>
                  <h3>Field Completion Rates</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                      data={generateAnalyticsData(viewingAnalytics).fieldCompletion}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="field" width={100} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                      <Bar dataKey="completion" fill="#6CE0F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Option Distribution */}
                {generateAnalyticsData(viewingAnalytics).optionDistribution.length > 0 && (
                  <div className={styles.chartContainer}>
                    <h3>Option Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={generateAnalyticsData(viewingAnalytics).optionDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {generateAnalyticsData(viewingAnalytics).optionDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
            
            <div className={styles.modalActions}>
              <button onClick={() => setViewingAnalytics(null)} className={styles.cancelBtn}>
                <FiX /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forms;