import mongoose, { Schema, models } from "mongoose";

const replySchema = new Schema(
  {
    id: { type: String, required: true },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    sentBy: { type: String, default: "Admin" },
  },
  { _id: false }
);

// NEW: Form template schema (for the Forms component)
const formSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    fields: [
      {
        id: { type: String, required: true },
        type: { 
          type: String, 
          enum: ["text", "email", "number", "textarea", "checkbox", "date", "dropdown", "file"],
          required: true 
        },
        label: { type: String, required: true },
        required: { type: Boolean, default: false },
        placeholder: { type: String },
        options: [{ type: String }] // For dropdown fields
      }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// UPDATED: Client request schema (for both contact forms and form submissions)
const clientRequestSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["contact_form", "form_submission"],
      required: true,
    },
    formId: { type: String }, // NEW: Reference to the form template
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String }, // For contact forms
    
    // UPDATED: For form submissions - better structure
    formData: {
      formTitle: { type: String },
      // Changed from array to Map to match your Forms component structure
      submissionData: {
        type: Map,
        of: String
      }
    },
    
    submittedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["new", "replied", "closed"],
      default: "new",
    },
    replies: [replySchema],
  },
  { timestamps: true }
);

// Export both models
const ClientRequestModel =
  models.ClientRequestModel ||
  mongoose.model("ClientRequestModel", clientRequestSchema);

const FormModel =
  models.FormModel ||
  mongoose.model("FormModel", formSchema);

export { ClientRequestModel, FormModel };
export default ClientRequestModel; 