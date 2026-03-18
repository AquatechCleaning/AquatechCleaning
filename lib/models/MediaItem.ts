import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMediaItem extends Document {
  type: "beforeAfter";
  title: string;
  description?: string;
  serviceType?: string;
  locationLabel?: string;
  imageBeforeUrl: string;
  imageAfterUrl: string;
  featured: boolean;
  createdAt: Date;
}

const MediaItemSchema = new Schema<IMediaItem>(
  {
    type: { type: String, enum: ["beforeAfter"], default: "beforeAfter" },
    title: { type: String, required: true },
    description: String,
    serviceType: String,
    locationLabel: String,
    imageBeforeUrl: { type: String, required: true },
    imageAfterUrl: { type: String, required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const MediaItem: Model<IMediaItem> =
  mongoose.models.MediaItem || mongoose.model<IMediaItem>("MediaItem", MediaItemSchema);
