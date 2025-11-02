import { connectMongoDB } from "@/libs/config/db";
import { FormModel, ClientRequestModel } from "@/libs/models/ClientRequestModel";

// GET single form by ID
export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    
    const { id } = params;
    
    const form = await FormModel.findOne({ id });
    
    if (!form) {
      return new Response(
        JSON.stringify({ error: 'Form not found' }),
        { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(JSON.stringify(form), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching form:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch form' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// UPDATE form by ID
export async function PUT(request, { params }) {
  try {
    await connectMongoDB();
    
    const { id } = params;
    const body = await request.json();
    const { title, description, fields } = body;

    // Validate required fields
    if (!title || !fields || fields.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Title and at least one field are required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const updatedForm = await FormModel.findOneAndUpdate(
      { id },
      {
        title,
        description: description || '',
        fields: fields.map(field => ({
          ...field,
          id: field.id || `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedForm) {
      return new Response(
        JSON.stringify({ error: 'Form not found' }),
        { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(JSON.stringify(updatedForm), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating form:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update form' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// DELETE form by ID
export async function DELETE(request, { params }) {
  try {
    await connectMongoDB();
    
    const { id } = params;
    
    // Delete the form
    const deletedForm = await FormModel.findOneAndDelete({ id });
    
    if (!deletedForm) {
      return new Response(
        JSON.stringify({ error: 'Form not found' }),
        { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Also delete all submissions associated with this form
    await ClientRequestModel.deleteMany({ 
      formId: id,
      type: "form_submission" 
    });
    
    return new Response(
      JSON.stringify({ 
        message: 'Form and associated submissions deleted successfully',
        deletedForm 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error deleting form:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete form' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}