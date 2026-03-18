import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IInvoice extends Document {
  jobId: Types.ObjectId;
  invoiceNumber: string;
  invoiceDate: Date;
  totalAmount: number;
  paid: boolean;
  paidDate?: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    invoiceNumber: { type: String, required: true },
    invoiceDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    paidDate: Date,
  },
  { timestamps: true }
);

export const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
