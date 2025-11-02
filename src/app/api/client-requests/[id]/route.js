import { connectMongoDB } from "@/libs/config/db";
import { ClientRequestModel } from "@/libs/models/ClientRequestModel";

// GET single client request by ID
export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    
    const { id } = params;
    
    const requestItem = await ClientRequestModel.findOne({ id });
    
    if (!requestItem) {
      return new Response(
        JSON.stringify({ error: 'Client request not found' }),
        { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(JSON.stringify(requestItem), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching client request:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch client request' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// UPDATE client request (add reply, change status)
export async function PUT(request, { params }) {
  try {
    await connectMongoDB();
    
    const { id } = params;
    const body = await request.json();
    const { status, replies } = body;

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
export async function DELETE(request, { params }) {
  try {
    await connectMongoDB();
    
    const { id } = params;
    
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