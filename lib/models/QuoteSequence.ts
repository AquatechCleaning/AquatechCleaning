import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuoteSequence extends Document {
  key: string;
  nextNumber: number;
}

const QuoteSequenceSchema = new Schema<IQuoteSequence>(
  {
    key: { type: String, required: true, unique: true },
    nextNumber: { type: Number, required: true },
  },
  { timestamps: true }
);

export const QuoteSequence: Model<IQuoteSequence> =
  mongoose.models.QuoteSequence || mongoose.model<IQuoteSequence>("QuoteSequence", QuoteSequenceSchema);
