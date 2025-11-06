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

// Handle POST requests (for sending replies)
export async function POST(request) {
  try {
    await connectMongoDB();
    
    const body = await request.json();
    const { action, requestId, replyMessage, replyData } = body;

    if (action === "send-reply") {
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

      // Generate email HTML for the reply
      const emailHtml = generateReplyEmailTemplate({
        clientName: originalRequest.name,
        originalMessage: originalRequest.message || originalRequest.formData?.formTitle,
        replyMessage: replyMessage,
        projectType: originalRequest.projectType,
        submittedAt: originalRequest.submittedAt
      });

      // Send email via nodemailer
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: originalRequest.email,
        subject: `Re: ${originalRequest.subject}`,
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

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error sending reply:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send reply: ' + error.message }),
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

// Function to generate email template for replies
function generateReplyEmailTemplate(data) {
  const { clientName, originalMessage, replyMessage, projectType, submittedAt, type, formTitle } = data;
  
  const isFormSubmission = type === "form_submission";
  const originalContent = isFormSubmission 
    ? `Form: ${formTitle}`
    : originalMessage;

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reply to Your ${isFormSubmission ? 'Form Submission' : 'Inquiry'}</title>
    <style>
        /* ... your existing styles ... */
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="logo">GammaDevs</div>
            <h1 class="header-title">Response to Your ${isFormSubmission ? 'Form Submission' : 'Inquiry'}</h1>
        </div>
        
        <div class="email-body">
            <p class="greeting">Hi ${clientName},</p>
            
            <p>Thank you for ${isFormSubmission ? 'submitting the form' : 'reaching out to us'}. Here's our response:</p>
            
            <div class="reply-section">
                <span class="reply-label">Our Response:</span>
                <div class="reply-content">${replyMessage}</div>
            </div>
            
            <div class="original-context">
                <span class="context-label">Your Original ${isFormSubmission ? 'Form' : 'Message'}:</span>
                <div class="reply-content">${originalContent}</div>
            </div>
            
            <div class="next-steps">
                <h4>What's Next?</h4>
                <p>We'll continue this conversation via email. Feel free to reply directly to this email if you have any further questions.</p>
            </div>
            
            <div class="metadata">
                <strong>Reference Information:</strong><br>
                ${!isFormSubmission && projectType ? `Project Type: ${projectType}<br>` : ''}
                ${isFormSubmission ? `Form: ${formTitle}<br>` : ''}
                Submitted: ${new Date(submittedAt).toLocaleDateString()}<br>
                <br>
                <em>We're here to help ${isFormSubmission ? 'with your submission' : 'bring your project to life'}!</em>
            </div>
        </div>
        
        <div class="email-footer">
            <p class="footer-text">
                This email is in response to your ${isFormSubmission ? 'form submission' : 'inquiry'} through GammaDevs.
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