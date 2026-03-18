import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  message?: string;
  source?: string;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    message: String,
    source: { type: String, default: "Contact Form" },
  },
  { timestamps: true }
);

export const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
