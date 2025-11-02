import { NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/config/db";
import TeamModel from "@/libs/models/Teams";

export async function POST(req) {
    try {
        const teamData = await req.json();
        
        console.log("Received team data:", teamData);

        // Validate required fields
        if (!teamData.name || !teamData.role || !teamData.desc || !teamData.image) {
            return NextResponse.json(
                { message: "Missing required fields: name, role, desc, and image are required" },
                { status: 400 }
            );
        }

        await connectMongoDB();
        console.log("DB Connected");

        const newTeamMember = await TeamModel.create({
            name: teamData.name,
            image: teamData.image,
            role: teamData.role,
            desc: teamData.desc,
            link: teamData.link || "#",
            socials: teamData.socials || [],
        });

        console.log("Team member created successfully:", newTeamMember._id);

        return NextResponse.json(
            { 
                message: "Team member created successfully",
                teamMember: newTeamMember 
            },
            { status: 201 }
        );
        
    } catch (error) {
        console.error("Error creating team member:", error);
        return NextResponse.json(
            { message: "Error creating team member", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectMongoDB();
        const teamMembers = await TeamModel.find().sort({ createdAt: -1 });
        
        console.log(`Fetched ${teamMembers.length} team members`);
        
        return NextResponse.json(teamMembers, { status: 200 });
    } catch (error) {
        console.error("Error fetching team members:", error);
        return NextResponse.json(
            { message: "Error fetching team members", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
  await connectMongoDB();

  try {
    const { id } = await req.json();
    console.log("Deleting member with ID:", id);

    if (!id) {
      return NextResponse.json(
        { message: "Team member ID is required" },
        { status: 400 }
      );
    }

    const deletedTeamMember = await TeamModel.findByIdAndDelete(id);

    if (!deletedTeamMember) {
      return NextResponse.json(
        { message: "Team member not found" },
        { status: 404 }
      );
    }

    console.log("Team member deleted successfully:", id);

    return NextResponse.json(
      { message: "Team member deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { message: "Error deleting team member", error: error.message },
      { status: 500 }
    );
  }
}
