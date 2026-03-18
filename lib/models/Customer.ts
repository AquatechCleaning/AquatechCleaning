import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  surname: string;
  email: string;
  phone: string;
  createdAt: Date;
  isRepeatCustomer?: boolean;
  companyName?: string;
  companyRegNumber?: string;
  vatNumber?: string;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    companyName: { type: String },
    companyRegNumber: { type: String },
    vatNumber: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Customer: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);
