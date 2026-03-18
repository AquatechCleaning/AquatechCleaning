import mongoose, { Schema, Document, Model } from "mongoose";

export type PricingServiceKey =
  | "roof"
  | "gutters"
  | "driveway"
  | "tiles"
  | "wall"
  | "house_wash"
  | "miscellaneous"
  | "windows"
  | "solar_panels";

export interface IPricingSettings extends Document {
  rates: Record<PricingServiceKey, number>;
  minimumFee: number;
  vatIncluded: boolean;
  vatRate: number;
}

const PricingSettingsSchema = new Schema<IPricingSettings>(
  {
    rates: {
      roof: { type: Number, default: 35 },
      gutters: { type: Number, default: 22 },
      driveway: { type: Number, default: 25 },
      tiles: { type: Number, default: 30 },
      wall: { type: Number, default: 28 },
      house_wash: { type: Number, default: 26 },
      miscellaneous: { type: Number, default: 28 },
      windows: { type: Number, default: 18 },
      solar_panels: { type: Number, default: 18 },
    },
    minimumFee: { type: Number, default: 1500 },
    vatIncluded: { type: Boolean, default: false },
    vatRate: { type: Number, default: 0.15 },
  },
  { timestamps: true }
);

export const PricingSettings: Model<IPricingSettings> =
  mongoose.models.PricingSettings ||
  mongoose.model<IPricingSettings>("PricingSettings", PricingSettingsSchema);
