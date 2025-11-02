import { NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/config/db";
import ProjectModel from "@/libs/models/ProjectModel";

export async function POST(req) {
    try {
        const projectData = await req.json();
        
        console.log("Received project data:", projectData);

        // Validate required fields
        if (!projectData.title || !projectData.description || !projectData.backgroundImage) {
            return NextResponse.json(
                { message: "Missing required fields: title, description, and backgroundImage are required" },
                { status: 400 }
            );
        }

        await connectMongoDB();
        console.log("DB Connected");

        const newProject = await ProjectModel.create({
            title: projectData.title,
            description: projectData.description,
            detailedDescription: projectData.detailedDescription || "",
            category: projectData.category || [],
            images: projectData.images || [],
            backgroundImage: projectData.backgroundImage,
            liveLink: projectData.liveLink || "#",
            githubLink: projectData.githubLink || "#",
            techStack: projectData.techStack || [],
            features: projectData.features || [],
            challenges: projectData.challenges || [],
            solutions: projectData.solutions || [],
            status: projectData.status || "Planned",
            timeline: projectData.timeline || "",
            teamSize: projectData.teamSize || 1,
        });

        console.log("Project created successfully:", newProject._id);

        return NextResponse.json(
            { 
                message: "Project created successfully",
                project: newProject 
            },
            { status: 201 }
        );
        
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { message: "Error creating project", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectMongoDB();
        const projects = await ProjectModel.find().sort({ createdAt: -1 });
        
        console.log(`Fetched ${projects.length} projects`);
        
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { message: "Error fetching projects", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    await connectMongoDB();

    try {
        const { id } = await req.json();
        console.log("Deleting project with ID:", id);

        if (!id) {
            return NextResponse.json(
                { message: "Project ID is required" },
                { status: 400 }
            );
        }

        const deletedProject = await ProjectModel.findByIdAndDelete(id);

        if (!deletedProject) {
            return NextResponse.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }

        console.log("Project deleted successfully:", id);

        return NextResponse.json(
            { message: "Project deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json(
            { message: "Error deleting project", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const { id, ...updateData } = await req.json();
        console.log("Updating project with ID:", id);

        if (!id) {
            return NextResponse.json(
                { message: "Project ID is required" },
                { status: 400 }
            );
        }

        // Validate required fields
        if (!updateData.title || !updateData.description) {
            return NextResponse.json(
                { message: "Missing required fields: title and description are required" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        const updatedProject = await ProjectModel.findByIdAndUpdate(
            id,
            {
                title: updateData.title,
                description: updateData.description,
                detailedDescription: updateData.detailedDescription || "",
                category: updateData.category || [],
                images: updateData.images || [],
                backgroundImage: updateData.backgroundImage,
                liveLink: updateData.liveLink || "#",
                githubLink: updateData.githubLink || "#",
                techStack: updateData.techStack || [],
                features: updateData.features || [],
                challenges: updateData.challenges || [],
                solutions: updateData.solutions || [],
                status: updateData.status || "Planned",
                timeline: updateData.timeline || "",
                teamSize: updateData.teamSize || 1,
            },
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return NextResponse.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }

        console.log("Project updated successfully:", id);

        return NextResponse.json(
            { 
                message: "Project updated successfully", 
                project: updatedProject 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            { message: "Error updating project", error: error.message },
            { status: 500 }
        );
    }
}