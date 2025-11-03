import { connectMongoDB } from "@/libs/config/db";
import { ClientRequestModel } from "@/libs/models/ClientRequestModel";
import nodemailer from "nodemailer";

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Handle contact form submissions
export async function POST(request) {
  try {
    await connectMongoDB();
    
    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      company, 
      projectType, 
      budget, 
      timeline, 
      description,
      files = [] // Added files array from Cloudinary uploads
    } = body;

    // Validate required fields
    if (!name || !email || !description) {
      return new Response(
        JSON.stringify({ 
          error: 'Name, email, and project description are required' 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate unique ID for the contact request
    const requestId = `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Generate subject from project type and company
    const subject = `Project Inquiry: ${projectType || 'General'} from ${company || name}`;

    const newContactRequest = new ClientRequestModel({
      id: requestId,
      type: "contact_form",
      name,
      email,
      phone: phone || '',
      company: company || '',
      projectType: projectType || '',
      budget: budget || '',
      timeline: timeline || '',
      subject,
      message: description,
      submittedAt: new Date(),
      status: "new",
      replies: [],
      formId: null,
      formData: null,
      attachments: files.map(file => ({
        url: file.url,
        publicId: file.publicId,
        originalName: file.originalName,
        uploadedAt: new Date()
      }))
    });

    const savedRequest = await newContactRequest.save();
    
    // Send email notification
    try {
      const emailHtml = generateEmailTemplate({
        name,
        email,
        phone,
        company,
        projectType,
        budget,
        timeline,
        description,
        files, // Pass files to email template
        requestId: savedRequest.id,
        submittedAt: new Date().toLocaleString()
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'gammadevs0@gmail.com',
        subject: `🎯 New Project Inquiry: ${projectType || 'General'} from ${company || name}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the request if email fails, just log it
    }
    
    return new Response(
      JSON.stringify({ 
        message: 'Contact request submitted successfully',
        request: savedRequest,
        ok: true // Added ok flag for frontend validation
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating contact request:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit contact request' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Function to generate beautiful email template with file attachments
function generateEmailTemplate(formData) {
  const { 
    name, 
    email, 
    phone, 
    company, 
    projectType, 
    budget, 
    timeline, 
    description, 
    files = [], // Added files parameter
    requestId, 
    submittedAt 
  } = formData;
  
  // Helper function to get file type icon
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const icons = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      default: '📎'
    };
    return icons[extension] || icons.default;
  };

  // Helper function to format file size
  const formatFileSize = (url) => {
    // Since we don't have file size from Cloudinary, we'll show the file type
    const extension = url.split('.').pop().toLowerCase();
    return extension.toUpperCase() + ' File';
  };
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Project Inquiry</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Montserrat', sans-serif;
            background: linear-gradient(135deg, #083365 0%, #0A0A0A 100%);
            color: #FAFAFF;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .email-header {
            background: linear-gradient(135deg, #32D0EB 0%, #6CE0F6 100%);
            font-weight: 700;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        
        .logo {
            font-size: 2.5rem;
            font-weight: 700;
            color: #083365;
            margin-bottom: 10px;
        }
        
        .header-title {
            font-size: 1.8rem;
            font-weight: 600;
            color: #083365;
            margin-bottom: 5px;
        }
        
        .header-subtitle {
            font-size: 1rem;
            color: #083365;
            opacity: 0.9;
        }
        
        .email-body {
            padding: 40px 30px;
            background: rgb(0, 0, 0);
        }
        
        .notification-badge {
            background: linear-gradient(135deg, #32D0EB 0%, #6CE0F6 100%);
            color: #083365;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 25px;
        }
        
        .intro-text {
            font-size: 1.1rem;
            margin-bottom: 30px;
            color: #FAFAFF;
            opacity: 0.9;
        }
        
        .details-grid {
            display: grid;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .detail-row {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 15px;
            padding: 15px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .detail-label {
            font-weight: 600;
            color: #6CE0F6;
            font-size: 0.95rem;
        }
        
        .detail-value {
            color: #FAFAFF;
            font-size: 0.95rem;
        }
        
        .description-section {
            background: rgba(255, 255, 255, 0.08);
            padding: 25px;
            border-radius: 12px;
            border-left: 4px solid #32D0EB;
            margin: 25px 0;
        }
        
        .description-label {
            font-weight: 600;
            color: #6CE0F6;
            margin-bottom: 10px;
            display: block;
        }
        
        .description-content {
            color: #FAFAFF;
            line-height: 1.7;
            white-space: pre-wrap;
        }

        /* File Attachments Section */
        .attachments-section {
            background: rgba(255, 255, 255, 0.08);
            padding: 25px;
            border-radius: 12px;
            border-left: 4px solid #6CE0F6;
            margin: 25px 0;
        }

        .attachments-label {
            font-weight: 600;
            color: #6CE0F6;
            margin-bottom: 15px;
            display: block;
            font-size: 1.1rem;
        }

        .attachments-grid {
            display: grid;
            gap: 12px;
        }

        .attachment-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }

        .attachment-item:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-1px);
        }

        .file-icon {
            font-size: 1.5rem;
            flex-shrink: 0;
        }

        .file-info {
            flex: 1;
            min-width: 0;
        }

        .file-name {
            font-weight: 500;
            color: #FAFAFF;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .file-meta {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.7);
        }

        .file-link {
            background: linear-gradient(135deg, #32D0EB 0%, #6CE0F6 100%);
            color: #083365;
            padding: 6px 12px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 0.8rem;
            font-weight: 600;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }

        .file-link:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(50, 208, 235, 0.3);
        }
        
        .metadata {
            background: rgba(255, 255, 255, 0.05);
            padding: 20px;
            border-radius: 12px;
            margin-top: 25px;
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #32D0EB 0%, #6CE0F6 100%);
            color: #083365;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            margin-top: 20px;
            transition: transform 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .email-footer {
            background: rgba(0, 0, 0, 0.3);
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .footer-text {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            margin-bottom: 10px;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .email-header, .email-body {
                padding: 25px 20px;
            }
            
            .detail-row {
                grid-template-columns: 1fr;
                gap: 8px;
            }
            
            .logo {
                font-size: 2rem;
            }
            
            .header-title {
                font-size: 1.5rem;
            }

            .attachment-item {
                flex-direction: column;
                text-align: center;
                gap: 8px;
            }

            .file-info {
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="logo">GammaDevs</div>
            <h1 class="header-title">New Project Inquiry</h1>
            <p class="header-subtitle">A new client has reached out through your contact form</p>
        </div>
        
        <div class="email-body">
            <div class="notification-badge">🎯 Action Required</div>
            
            <p class="intro-text">
                Great news! You've received a new project inquiry. Here are the details submitted by the client:
            </p>
            
            <div class="details-grid">
                <div class="detail-row">
                    <span class="detail-label">Client Name:</span>
                    <span class="detail-value">${name}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Email Address:</span>
                    <span class="detail-value">${email}</span>
                </div>
                
                ${phone ? `
                <div class="detail-row">
                    <span class="detail-label">Phone Number:</span>
                    <span class="detail-value">${phone}</span>
                </div>
                ` : ''}
                
                ${company ? `
                <div class="detail-row">
                    <span class="detail-label">Company:</span>
                    <span class="detail-value">${company}</span>
                </div>
                ` : ''}
                
                ${projectType ? `
                <div class="detail-row">
                    <span class="detail-label">Project Type:</span>
                    <span class="detail-value">${projectType}</span>
                </div>
                ` : ''}
                
                ${budget ? `
                <div class="detail-row">
                    <span class="detail-label">Budget:</span>
                    <span class="detail-value">${budget}</span>
                </div>
                ` : ''}
                
                ${timeline ? `
                <div class="detail-row">
                    <span class="detail-label">Timeline:</span>
                    <span class="detail-value">${timeline}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="description-section">
                <span class="description-label">Project Description:</span>
                <div class="description-content">${description}</div>
            </div>

            ${files.length > 0 ? `
            <div class="attachments-section">
                <span class="attachments-label">📎 Attached Files (${files.length})</span>
                <div class="attachments-grid">
                    ${files.map(file => `
                    <div class="attachment-item">
                        <div class="file-icon">${getFileIcon(file.originalName)}</div>
                        <div class="file-info">
                            <div class="file-name">${file.originalName}</div>
                            <div class="file-meta">${formatFileSize(file.url)} • Cloudinary</div>
                        </div>
                        <a href="${file.url}" target="_blank" class="file-link">View File</a>
                    </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="metadata">
                <strong>Submission Details:</strong><br>
                Request ID: ${requestId}<br>
                Submitted: ${submittedAt}<br>
                ${files.length > 0 ? `Attachments: ${files.length} file(s)<br>` : ''}
                <br>
                <em>Please respond to this inquiry within 24 hours.</em>
            </div>
            
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <a href="mailto:${email}" class="cta-button">
                    📧 Reply to Client
                </a>
                ${files.length > 0 ? `
                <a href="#attachments" class="cta-button" style="background: linear-gradient(135deg, #6CE0F6 0%, #32D0EB 100%);">
                    📎 Review Files (${files.length})
                </a>
                ` : ''}
            </div>
        </div>
        
        <div class="email-footer">
            <p class="footer-text">
                This email was automatically generated from your GammaDevs contact form.
            </p>
            <p class="footer-text">
                &copy; ${new Date().getFullYear()} GammaDevs. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
  `;
}