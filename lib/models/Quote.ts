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
  path?: Array<{ lat: number; lng: number }>;
  shape?: "polygon" | "polyline" | "manual";
}

export interface IQuote extends Document {
  customerId: Types.ObjectId;
  propertyId: Types.ObjectId;
  areas: IQuoteArea[];
  notes?: string;
  createdAt: Date;
  status: "Pending" | "Sent" | "Accepted" | "Scheduled" | "Declined" | "Callback Requested" | "Expired";
  declineReason?: string;
  totalAmount: number;
  currency: string;
  leadSource: string;
  geo?: { lat: number; lng: number };
  mapImageUrl?: string;
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
    notes: String,
    status: {
      type: String,
      enum: ["Pending", "Sent", "Accepted", "Scheduled", "Declined", "Callback Requested", "Expired"],
      default: "Pending",
    },
    declineReason: String,
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "ZAR" },
    leadSource: { type: String, default: "Website Self-Quote" },
    geo: { lat: Number, lng: Number },
    mapImageUrl: String,
    quoteNumber: { type: String },
    reference: { type: String },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development" && mongoose.models.Quote) {
  delete mongoose.models.Quote;
}

export const Quote: Model<IQuote> =
  mongoose.models.Quote || mongoose.model<IQuote>("Quote", QuoteSchema);
