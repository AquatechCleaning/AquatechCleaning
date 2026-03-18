import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type AreaType =
  | "roof"
  | "paving"
  | "wall"
  | "other"
  | "gutters"
  | "driveway"
  | "tiles"
  | "house_wash"
  | "miscellaneous"
  | "windows"
  | "solar_panels";

export interface IQuoteArea {
  type: AreaType;
  sqm: number;
  details?: string;
}

export interface IQuote extends Document {
  customerId: Types.ObjectId;
  propertyId: Types.ObjectId;
  areas: IQuoteArea[];
  notes?: string;
  createdAt: Date;
  status: "Pending" | "Sent" | "Accepted" | "Declined" | "Expired";
  declineReason?: string;
  totalAmount: number;
  currency: string;
  leadSource: string;
  geo?: { lat: number; lng: number };
  quoteNumber?: string;
  reference?: string;
  dueDate?: Date;
}

const QuoteSchema = new Schema<IQuote>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    areas: [
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
          required: true,
        },
        sqm: { type: Number, required: true },
        details: String,
      },
    ],
    notes: String,
    status: {
      type: String,
      enum: ["Pending", "Sent", "Accepted", "Declined", "Expired"],
      default: "Pending",
    },
    declineReason: String,
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "ZAR" },
    leadSource: { type: String, default: "Website Self-Quote" },
    geo: { lat: Number, lng: Number },
    quoteNumber: { type: String },
    reference: { type: String },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

export const Quote: Model<IQuote> =
  mongoose.models.Quote || mongoose.model<IQuote>("Quote", QuoteSchema);
