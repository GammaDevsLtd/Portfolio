import { connectMongoDB } from "@/libs/config/db";
import { ClientRequestModel } from "@/libs/models/ClientRequestModel";

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
      description 
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
      message: description, // Using description as the message
      submittedAt: new Date(),
      status: "new",
      replies: [],
      formId: null, // Not applicable for contact forms
      formData: null, // Not applicable for contact forms
      attachments: [] // Can be extended for file uploads later
    });

    const savedRequest = await newContactRequest.save();
    
    return new Response(
      JSON.stringify({ 
        message: 'Contact request submitted successfully',
        request: savedRequest 
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