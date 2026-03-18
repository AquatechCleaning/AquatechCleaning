import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProperty extends Document {
  customerId: Types.ObjectId;
  address: string;
  propertyType?: "residential" | "commercial";
  city?: string;
  suburb?: string;
  country?: string;
  coordinates?: { lat: number; lng: number };
  createdAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    address: { type: String, required: true },
    propertyType: {
      type: String,
      enum: ["residential", "commercial"],
      default: "residential",
    },
    city: String,
    suburb: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Property: Model<IProperty> =
  mongoose.models.Property || mongoose.model<IProperty>("Property", PropertySchema);
