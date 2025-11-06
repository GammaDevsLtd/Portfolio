import { connectMongoDB } from "@/libs/config/db";
import { ClientRequestModel, FormModel } from "@/libs/models/ClientRequestModel";

export async function POST(request) {
  try {
    await connectMongoDB();
    
    // Check content type and parse accordingly
    const contentType = request.headers.get('content-type');
    
    let formId, submittedAt, submissionData;

    if (contentType && contentType.includes('application/json')) {
      // Handle JSON data
      const body = await request.json();
      formId = body.formId;
      submittedAt = body.submittedAt;
      submissionData = body.submissionData;
    } else if (contentType && contentType.includes('multipart/form-data')) {
      // Handle FormData (for future file uploads)
      const formData = await request.formData();
      formId = formData.get('formId');
      submittedAt = formData.get('submittedAt');
      submissionData = JSON.parse(formData.get('submissionData') || '{}');
    } else {
      return new Response(
        JSON.stringify({ error: 'Unsupported content type' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate required fields
    if (!formId) {
      return new Response(
        JSON.stringify({ error: 'Form ID is required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the form to extract email and name if available
    const form = await FormModel.findOne({ id: formId });
    if (!form) {
      return new Response(
        JSON.stringify({ error: 'Form not found' }),
        { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Extract email and name from submission data for flexible forms
    let email = '';
    let name = '';
    let subject = `Form Submission: ${form.title}`;

    // Look for email and name fields in the form submission
    if (submissionData) {
      form.fields.forEach(field => {
        const value = submissionData[field.id];
        if (field.type === 'email' && value) {
          email = value;
        }
        if ((field.label.toLowerCase().includes('name') || field.id.toLowerCase().includes('name')) && value) {
          name = value;
        }
      });
    }

    // Create the client request
    const clientRequest = new ClientRequestModel({
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "form_submission",
      formId: formId,
      formTitle: form.title,
      name: name || 'Anonymous User',
      email: email,
      subject: subject,
      submissionData: submissionData || {},
      submittedAt: new Date(submittedAt || Date.now()),
      status: "new",
      replies: []
    });

    await clientRequest.save();

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Form submission saved successfully',
        clientRequest 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error submitting form:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit form: ' + error.message }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// GET submissions for a specific form
export async function GET(request) {
  try {
    await connectMongoDB();
    
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');
    
    let filter = { type: "form_submission" };
    if (formId) {
      filter.formId = formId;
    }

    const submissions = await ClientRequestModel.find(filter).sort({ submittedAt: -1 });
    
    return new Response(JSON.stringify({ submissions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch submissions' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}