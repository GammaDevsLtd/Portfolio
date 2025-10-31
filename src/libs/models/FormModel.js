import mongoose, { Schema, models } from "mongoose";

// 🔹 1. Field Schema — represents each form input
const fieldSchema = new Schema(
  {
    id: {
      type: String,
      required: true, // unique field ID for mapping data
    },
    type: {
      type: String,
      required: true, // text, email, dropdown, checkbox, etc.
    },
    label: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
    },
    options: {
      type: [String], // for dropdowns or checkboxes
      default: [],
    },
  },
  { _id: false } // prevent mongoose from creating an extra _id for each field
);

// 🔹 2. Submission Schema — stores a user's response
const submissionSchema = new Schema(
  {
    id: {
      type: String,
      required: true, // same pattern as frontend (like 'sub-1')
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    data: {
      type: Map,
      of: String, // flexible key:value storage for form data (key = field.id)
      default: {},
    },
  },
  { _id: false }
);

// 🔹 3. Form Schema — combines it all
const formSchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    fields: {
      type: [fieldSchema], // embeds fieldSchema array
      default: [],
    },
    submissions: {
      type: [submissionSchema], // embeds submissionSchema array
      default: [],
    },
  },
  { timestamps: true }
);

// 🔹 4. Model Export
const FormModel = models.FormModel || mongoose.model("FormModel", formSchema);
export default FormModel;
