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
  const { clientName, originalMessage, replyMessage, projectType, submittedAt } = data;
  
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