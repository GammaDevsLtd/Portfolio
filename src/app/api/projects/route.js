import { NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/config/db";
import ProjectModel from "@/libs/models/ProjectModel";

export async function POST(req) {
    try {
        const projectData = await req.json();
        
        console.log("Received post data:", projectData);

        await connectMongoDB();
        console.log("DB Connected")

        await ProjectModel.create({
            title: projectData.title,
            description: projectData.description,
            image: projectData.image,
            link: projectData.link,
            category: projectData.category || [],
        });

        return NextResponse.json(
            { message: "Project uploaded successfully" },
            { status: 201 }
        );
        
    } catch (error) {
        console.error("Error uploading Project:", error);
        return NextResponse.json(
            { message: "Error uploading Project", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectMongoDB();
        const projects = await ProjectModel.find().sort({ createdAt: -1 });
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching Projects", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        await connectMongoDB();
        await ProjectModel.findByIdAndDelete(id);
        
        return NextResponse.json(
            { message: "Project deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error deleting Project", error: error.message },
            { status: 500 }
        );
    }
}