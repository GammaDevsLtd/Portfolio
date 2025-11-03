import { NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/config/db";
import ProjectModel from "@/libs/models/ProjectModel";

export async function GET(request, { params }) {
  try {
    // Properly await the params promise
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (!id) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    
    const project = await ProjectModel.findById(id);
    
    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { message: "Error fetching project", error: error.message },
      { status: 500 }
    );
  }
}