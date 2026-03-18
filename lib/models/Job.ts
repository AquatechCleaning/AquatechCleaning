import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IQuoteArea } from "./Quote";

export interface IJob extends Document {
  quoteId: Types.ObjectId;
  customerId: Types.ObjectId;
  propertyId: Types.ObjectId;
  scheduledDate?: Date;
  completedDate?: Date;
  servicesPerformed?: IQuoteArea[];
  totalAreaSqm?: number;
  actualAmountCharged?: number;
  teamName?: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  rating?: number;
  feedback?: string;
}

const JobSchema = new Schema<IJob>(
  {
    quoteId: { type: Schema.Types.ObjectId, ref: "Quote", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    scheduledDate: Date,
    completedDate: Date,
    servicesPerformed: [
      {
        type: {
          type: String,
          enum: ["roof", "paving", "wall", "other"],
        },
        sqm: Number,
      },
    ],
    totalAreaSqm: Number,
    actualAmountCharged: Number,
    teamName: String,
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    rating: Number,
    feedback: String,
  },
  { timestamps: true }
);

export const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
