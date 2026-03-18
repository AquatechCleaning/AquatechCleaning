import { z } from "zod";

export const areaSchema = z.object({
  type: z.enum([
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
  ]),
  sqm: z.number().positive(),
  details: z.string().optional(),
});

export const quoteSchema = z.object({
  name: z.string().min(2),
  surname: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  address: z.string().min(5),
  propertyType: z.enum(["residential", "commercial"]),
  companyName: z.string().optional(),
  companyRegNumber: z.string().optional(),
  vatNumber: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional()
    .nullable(),
  areas: z.array(areaSchema).min(1),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.propertyType === "commercial" && !data.companyName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["companyName"],
      message: "Business name is required for commercial quotes.",
    });
  }
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  message: z.string().min(5),
});
