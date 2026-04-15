import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IQuoteArea } from "./Quote";

export interface IJob extends Document {
  quoteId: Types.ObjectId;
  customerId: Types.ObjectId;
  propertyId: Types.ObjectId;
  scheduledDate?: Date;
  scheduledEndDate?: Date;
  scheduleType?: "half_day" | "full_day" | "multiple_days";
  scheduleSlot?: "morning" | "afternoon";
  completedDate?: Date;
  servicesPerformed?: IQuoteArea[];
  totalAreaSqm?: number;
  actualAmountCharged?: number;
  teamName?: string;
  notes?: string;
  calendarEventId?: string;
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
    scheduledEndDate: Date,
    scheduleType: {
      type: String,
      enum: ["half_day", "full_day", "multiple_days"],
    },
    scheduleSlot: {
      type: String,
      enum: ["morning", "afternoon"],
    },
    completedDate: Date,
    servicesPerformed: [
      {
        type: {
          type: String,
          enum: [
            "roof",
            "paving",
            "wall",
            "other",
            "gutters",
            "driveway",
            "tiles",
            "house_wash",
            "miscellaneous",
            "windows",
            "solar_panels",
          ],
        },
        sqm: Number,
        details: String,
        path: [
          {
            lat: Number,
            lng: Number,
          },
        ],
        shape: {
          type: String,
          enum: ["polygon", "polyline", "manual"],
        },
      },
    ],
    totalAreaSqm: Number,
    actualAmountCharged: Number,
    teamName: String,
    notes: String,
    calendarEventId: String,
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

if (process.env.NODE_ENV === "development" && mongoose.models.Job) {
  delete mongoose.models.Job;
}

export const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
