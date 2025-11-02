import { connectMongoDB } from "@/libs/config/db";
import { ClientRequestModel } from "@/libs/models/ClientRequestModel";

// GET submissions for a specific form
export async function GET(request) {
  try {
    await connectMongoDB();
    
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');
    
    if (!formId) {
      return new Response(
        JSON.stringify({ error: 'formId query parameter is required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Find all form submissions for the given formId
    const submissions = await ClientRequestModel.find({
      formId,
      type: "form_submission"
    }).sort({ submittedAt: -1 });
    
    return new Response(
      JSON.stringify({ 
        submissions,
        count: submissions.length 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
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

// CREATE new form submission
export async function POST(request) {
  try {
    await connectMongoDB();
    
    const body = await request.json();
    const { 
      formId, 
      name, 
      email, 
      formTitle, 
      submissionData 
    } = body;

    // Validate required fields
    if (!formId || !name || !email || !formTitle || !submissionData) {
      return new Response(
        JSON.stringify({ 
          error: 'formId, name, email, formTitle, and submissionData are required' 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate unique ID for the submission
    const submissionId = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newSubmission = new ClientRequestModel({
      id: submissionId,
      type: "form_submission",
      formId,
      name,
      email,
      subject: `Form Submission: ${formTitle}`,
      message: null, // Not used for form submissions
      formData: {
        formTitle,
        submissionData: new Map(Object.entries(submissionData))
      },
      submittedAt: new Date(),
      status: "new",
      replies: []
    });

    const savedSubmission = await newSubmission.save();
    
    return new Response(JSON.stringify(savedSubmission), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create submission' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}