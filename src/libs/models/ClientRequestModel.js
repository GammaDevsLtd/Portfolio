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

const clientRequestSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["contact_form", "form_submission"],
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String }, // For contact forms
    submittedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["new", "replied", "closed"],
      default: "new",
    },
    formData: {
      formTitle: { type: String },
      fields: [
        {
          label: String,
          value: String,
        },
      ],
    },
    replies: [replySchema],
  },
  { timestamps: true }
);

const ClientRequestModel =
  models.ClientRequestModel ||
  mongoose.model("ClientRequestModel", clientRequestSchema);

export default ClientRequestModel;
