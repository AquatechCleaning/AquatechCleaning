import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSettings extends Document {
  homepageHeroTitle?: string;
  homepageHeroSubtitle?: string;
  homepageHeroImageUrl?: string;
  statsPublic?: {
    showClientsServed?: boolean;
    showSqmCleaned?: boolean;
    showRepeatCustomers?: boolean;
  };
  contactPhone?: string;
  contactEmail?: string;
  companyName?: string;
  companyVatNumber?: string;
  companyRegNumber?: string;
  companyPostalAddress?: string;
  companyPhysicalAddress?: string;
  companySalesRep?: string;
  quoteNumberStart?: number;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    homepageHeroTitle: String,
    homepageHeroSubtitle: String,
    homepageHeroImageUrl: String,
    statsPublic: {
      showClientsServed: { type: Boolean, default: true },
      showSqmCleaned: { type: Boolean, default: true },
      showRepeatCustomers: { type: Boolean, default: true },
    },
    contactPhone: String,
    contactEmail: String,
    companyName: String,
    companyVatNumber: String,
    companyRegNumber: String,
    companyPostalAddress: String,
    companyPhysicalAddress: String,
    companySalesRep: String,
    quoteNumberStart: Number,
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
