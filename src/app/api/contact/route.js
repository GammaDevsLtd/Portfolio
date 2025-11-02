import ClientRequestModel from "@/libs/models/ClientRequestModel";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/config/db";

export async function POST(req) {
  try {
    await connectMongoDB();
    const data = await req.formData();

    const name = data.get("name");
    const email = data.get("email");
    const phone = data.get("phone");
    const company = data.get("company");
    const projectType = data.get("projectType");
    const budget = data.get("budget");
    const timeline = data.get("timeline");
    const description = data.get("description");
    const files = data.getAll("files"); // Handle if files exist

    // Save to DB
    const newRequest = await ClientRequestModel.create({
      id: `req-${Date.now()}`,
      type: "contact_form",
      name,
      email,
      subject: "New Contact Form Submission",
      message: description,
      formData: { projectType, budget, timeline, phone, company },
    });

    // Optional: Send email to admin
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: `New Project Request from ${name}`,
      html: `
        <h3>New Project Request</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Company:</b> ${company}</p>
        <p><b>Project Type:</b> ${projectType}</p>
        <p><b>Budget:</b> ${budget}</p>
        <p><b>Timeline:</b> ${timeline}</p>
        <p><b>Description:</b> ${description}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Form submitted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to submit form." },
      { status: 500 }
    );
  }
}
