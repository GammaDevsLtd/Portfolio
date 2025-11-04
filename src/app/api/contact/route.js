import { connectMongoDB } from "@/libs/config/db";
import { ClientRequestModel } from "@/libs/models/ClientRequestModel";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Single POST function that handles both contact submissions and replies
export async function POST(request) {
  try {
    await connectMongoDB();
    
    const body = await request.json();
    const { action } = body;

    // If action is "send-reply", handle email reply to client
    if (action === "send-reply") {
      const { requestId, replyMessage, replyData } = body;

      // Find the original request
      const originalRequest = await ClientRequestModel.findOne({ id: requestId });
      
      if (!originalRequest) {
        return new Response(
          JSON.stringify({ error: 'Client request not found' }),
          { 
            status: 404, 
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Generate email HTML for the reply WITH REQUEST ID IN SUBJECT
      const emailHtml = generateReplyEmailTemplate({
        clientName: originalRequest.name,
        originalMessage: originalRequest.message || originalRequest.formData?.formTitle,
        replyMessage: replyMessage,
        projectType: originalRequest.projectType,
        submittedAt: originalRequest.submittedAt,
        requestId: requestId // Include request ID
      });

      // Send email via nodemailer WITH REQUEST ID IN SUBJECT
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: originalRequest.email,
        subject: `Re: [Request:${requestId}] ${originalRequest.subject}`, // ADD REQUEST ID HERE
        html: emailHtml,
        replyTo: process.env.EMAIL_USER,
      });

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Reply sent successfully via email'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } 
    // Otherwise, handle new contact form submission
    else {
      const { 
        name, 
        email, 
        phone, 
        company, 
        projectType, 
        budget, 
        timeline, 
        description,
        files = []
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
      
      // Send email notification to YOURSELF (admin notification)
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
          files,
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
          ok: true
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error in POST request:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// GET all client requests with filtering
export async function GET(request) {
  try {
    await connectMongoDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    
    // Build filter object
    let filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (type && type !== 'all') {
      filter.type = type;
    }

    const requests = await ClientRequestModel.find(filter).sort({ submittedAt: -1 });
    
    return new Response(JSON.stringify(requests), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching client requests:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch client requests' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// UPDATE client request
export async function PUT(request) {
  try {
    await connectMongoDB();
    
    const body = await request.json();
    const { id, status, replies } = body;

    const updatedRequest = await ClientRequestModel.findOneAndUpdate(
      { id },
      {
        ...(status && { status }),
        ...(replies && { replies }),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return new Response(
        JSON.stringify({ error: 'Client request not found' }),
        { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(JSON.stringify(updatedRequest), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating client request:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update client request' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// DELETE client request
export async function DELETE(request) {
  try {
    await connectMongoDB();
    
    const body = await request.json();
    const { id } = body;
    
    const deletedRequest = await ClientRequestModel.findOneAndDelete({ id });
    
    if (!deletedRequest) {
      return new Response(
        JSON.stringify({ error: 'Client request not found' }),
        { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        message: 'Client request deleted successfully',
        deletedRequest 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error deleting client request:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete client request' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle PATCH requests (for client replies from Google Apps Script)
export async function PATCH(request) {
  try {
    await connectMongoDB();
    
    const body = await request.json();
    const { 
      action, 
      requestId, 
      clientReply, 
      clientEmail,
      repliedAt 
    } = body;

    if (action === "client-reply") {
      const clientRequest = await ClientRequestModel.findOne({ id: requestId });
      
      if (!clientRequest) {
        return new Response(
          JSON.stringify({ error: 'Client request not found' }),
          { 
            status: 404, 
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Add client's reply to the conversation
      const newClientReply = {
        id: `client-reply-${Date.now()}`,
        message: clientReply,
        sentAt: repliedAt || new Date().toISOString(),
        sentBy: clientEmail || clientRequest.email,
        type: "client"
      };

      const updatedRequest = await ClientRequestModel.findOneAndUpdate(
        { id: requestId },
        {
          $push: { replies: newClientReply },
          status: "replied",
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      // Send notification to admin about the client reply
      await sendAdminNotification(updatedRequest, newClientReply);

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Client reply recorded successfully',
          request: updatedRequest
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error processing client reply:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process client reply' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Function to send admin notification about client reply
async function sendAdminNotification(request, clientReply) {
  try {
    const emailHtml = generateClientReplyNotificationTemplate(request, clientReply);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `📩 Client Replied: ${request.name} - ${request.subject}`,
      html: emailHtml,
    });
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}

function generateClientReplyNotificationTemplate(request, clientReply) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Client Replied</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #32D0EB 0%, #6CE0F6 100%); padding: 20px; border-radius: 10px; color: white; text-align: center; }
        .content { padding: 20px 0; }
        .client-reply { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #32D0EB; margin: 15px 0; }
        .button { background: #32D0EB; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📩 Client Replied</h1>
            <p>${request.name} has responded to your email</p>
        </div>
        
        <div class="content">
            <h3>Client: ${request.name} (${request.email})</h3>
            <p><strong>Original Subject:</strong> ${request.subject}</p>
            
            <div class="client-reply">
                <strong>Client's Reply:</strong>
                <p>${clientReply.message}</p>
                <small>Sent: ${new Date(clientReply.sentAt).toLocaleString()}</small>
            </div>
            
            <p>You can view the full conversation and reply from your dashboard:</p>
            <a href="${process.env.APP_URL}/admin/client-requests" class="button">View Conversation</a>
            
            <p style="margin-top: 20px; color: #666;">
                <em>To reply, use the dashboard or reply directly to the client's email.</em>
            </p>
        </div>
    </div>
</body>
</html>
  `;
}

// Function to generate email template for replies (to clients)
function generateReplyEmailTemplate(data) {
  const { clientName, originalMessage, replyMessage, projectType, submittedAt, requestId } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reply to Your Inquiry</title>
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
            padding: 40px 30px;
            text-align: center;
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
        
        .email-body {
            padding: 40px 30px;
            background: rgb(0, 0, 0);
        }
        
        .greeting {
            font-size: 1.2rem;
            margin-bottom: 25px;
            color: #FAFAFF;
        }
        
        .reply-section {
            background: rgba(255, 255, 255, 0.08);
            padding: 25px;
            border-radius: 12px;
            border-left: 4px solid #32D0EB;
            margin: 25px 0;
        }
        
        .reply-label {
            font-weight: 600;
            color: #6CE0F6;
            margin-bottom: 15px;
            display: block;
        }
        
        .reply-content {
            color: #FAFAFF;
            line-height: 1.7;
            white-space: pre-wrap;
        }
        
        .original-context {
            background: rgba(255, 255, 255, 0.05);
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
            border-left: 4px solid #6CE0F6;
        }
        
        .context-label {
            font-weight: 600;
            color: #6CE0F6;
            margin-bottom: 10px;
            display: block;
        }
        
        .metadata {
            background: rgba(255, 255, 255, 0.05);
            padding: 20px;
            border-radius: 12px;
            margin-top: 25px;
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .next-steps {
            margin: 25px 0;
            padding: 20px;
            background: rgba(50, 208, 235, 0.1);
            border-radius: 12px;
            border: 1px solid rgba(50, 208, 235, 0.3);
        }
        
        .next-steps h4 {
            color: #6CE0F6;
            margin-bottom: 10px;
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
            
            .logo {
                font-size: 2rem;
            }
            
            .header-title {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="logo">GammaDevs</div>
            <h1 class="header-title">Response to Your Inquiry</h1>
        </div>
        
        <div class="email-body">
            <p class="greeting">Hi ${clientName},</p>
            
            <p>Thank you for reaching out to us. Here's our response to your inquiry:</p>
            
            <div class="reply-section">
                <span class="reply-label">Our Response:</span>
                <div class="reply-content">${replyMessage}</div>
            </div>
            
            <div class="original-context">
                <span class="context-label">Your Original Message:</span>
                <div class="reply-content">${originalMessage}</div>
            </div>
            
            <div class="next-steps">
                <h4>What's Next?</h4>
                <p>We'll continue this conversation via email. Feel free to reply directly to this email if you have any further questions or need clarification.</p>
                <p><small>Reference ID: ${requestId}</small></p>
            </div>
            
            <div class="metadata">
                <strong>Reference Information:</strong><br>
                ${projectType ? `Project Type: ${projectType}<br>` : ''}
                Submitted: ${new Date(submittedAt).toLocaleDateString()}<br>
                <br>
                <em>We're here to help bring your project to life!</em>
            </div>
        </div>
        
        <div class="email-footer">
            <p class="footer-text">
                This email is in response to your inquiry through GammaDevs.
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