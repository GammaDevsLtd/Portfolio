import { connectMongoDB } from "@/libs/config/db";
import { FormModel, ClientRequestModel } from "@/libs/models/ClientRequestModel";

// GET all forms
export async function GET(request) {
  try {
    await connectMongoDB();
    
    const forms = await FormModel.find({}).sort({ createdAt: -1 });
    
    return new Response(JSON.stringify(forms), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch forms' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// CREATE new form
export async function POST(request) {
  try {
    await connectMongoDB();
    
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

    // Generate unique ID
    const formId = `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newForm = new FormModel({
      id: formId,
      title,
      description: description || '',
      fields: fields.map(field => ({
        ...field,
        id: field.id || `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedForm = await newForm.save();
    
    return new Response(JSON.stringify(savedForm), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating form:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create form' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}