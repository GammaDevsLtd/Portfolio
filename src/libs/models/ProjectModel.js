import mongoose, { Schema, models } from "mongoose";

const techStackSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // e.g., Frontend, Backend, Database, etc.
    icon: { type: String }, // Optional — store icon name or URL (not React elements)
  },
  { _id: false }
);

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    detailedDescription: {
      type: String,
    },

    category: {
      type: [String],
      required: true,
      default: [],
    },

    images: {
      type: [String], // multiple project screenshots
      required: true,
      default: [],
    },

    backgroundImage: {
      type: String,
    },

    liveLink: {
      type: String,
    },

    githubLink: {
      type: String,
    },

    techStack: {
      type: [techStackSchema],
      required: true,
      default: [],
    },

    features: {
      type: [String],
      default: [],
    },

    challenges: {
      type: [String],
      default: [],
    },

    solutions: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["Planned", "In Progress", "Completed"],
      default: "Planned",
    },

    timeline: {
      type: String,
    },

    teamSize: {
      type: Number,
    },
  },
  { timestamps: true }
);

const ProjectModel =
  models.ProjectModel || mongoose.model("ProjectModel", projectSchema);

export default ProjectModel;
