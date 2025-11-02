import { connectMongoDB } from "@/libs/config/db";
import { ClientRequestModel } from "@/libs/models/ClientRequestModel";

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