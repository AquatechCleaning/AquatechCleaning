import { IQuoteArea } from "./models/Quote";
import { PricingSettings } from "./models/PricingSettings";

export type PricingRule = Record<string, number>;

const defaultPricing: PricingRule = {
  roof: 35,
  gutters: 22,
  driveway: 25,
  tiles: 30,
  wall: 28,
  house_wash: 26,
  miscellaneous: 28,
  windows: 18,
  solar_panels: 18,
  other: 28,
};

const defaultMinimumFee = 1500;
const defaultVatRate = 0.15;

export type LineItem = { type: string; rate: number; sqm: number; amount: number };

export async function loadPricingSettings() {
  const settingsDoc = await PricingSettings.findOne();
  if (!settingsDoc) {
    return {
      rates: defaultPricing,
      minimumFee: defaultMinimumFee,
      vatIncluded: false,
      vatRate: defaultVatRate,
    };
  }

  return {
    rates: { ...defaultPricing, ...settingsDoc.rates },
    minimumFee: settingsDoc.minimumFee ?? defaultMinimumFee,
    vatIncluded: settingsDoc.vatIncluded ?? false,
    vatRate: settingsDoc.vatRate ?? defaultVatRate,
  };
}

export async function calculateQuote(areas: IQuoteArea[]) {
  const { rates, minimumFee, vatIncluded, vatRate } = await loadPricingSettings();

  const items: LineItem[] = areas.map((area) => {
    const rate = rates[area.type] ?? rates.other ?? defaultPricing.other;
    const amount = Math.round(area.sqm * rate);
    return { type: area.type, rate, sqm: area.sqm, amount };
  });

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const netTotal = subtotal < minimumFee ? minimumFee : subtotal;
  const vatAmount = vatIncluded ? Math.round(netTotal * vatRate) : 0;
  const total = vatIncluded ? netTotal + vatAmount : netTotal;

  return { items, subtotal, total, netTotal, minimumFee, vatIncluded, vatRate, vatAmount };
}

export const pricingNotes =
  "Pricing is indicative. Final quote may vary based on access, soil level, and equipment required.";
