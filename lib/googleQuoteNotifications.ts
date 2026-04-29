import { formatCurrency } from "@/lib/format";
import { ICustomer } from "@/lib/models/Customer";
import { IProperty } from "@/lib/models/Property";
import { IQuote } from "@/lib/models/Quote";

type QuoteNotificationEvent = "generated" | "accepted";

type NotifyQuoteArgs = {
  event: QuoteNotificationEvent;
  quote: IQuote;
  customer: ICustomer;
  property?: IProperty | null;
};

const eventLabels: Record<QuoteNotificationEvent, string> = {
  generated: "Quote generated",
  accepted: "Quote accepted",
};

const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "").replace(/\/$/, "");

const areaSummary = (quote: IQuote) =>
  quote.areas
    .map((area) => {
      const unit = area.type === "gutters" || area.type === "wall" || area.type === "house_wash" ? "m" : area.type === "windows" || area.type === "solar_panels" ? "units" : "m2";
      return `${area.type.replace("_", " ")}: ${area.sqm} ${unit}${area.details ? ` (${area.details})` : ""}`;
    })
    .join("\n");

export async function notifyQuoteByGoogleMail({ event, quote, customer, property }: NotifyQuoteArgs) {
  const webhookUrl = process.env.GOOGLE_MAIL_WEBHOOK_URL;
  const secret = process.env.GOOGLE_MAIL_WEBHOOK_SECRET;
  const recipients = process.env.QUOTE_NOTIFICATION_EMAILS;

  if (!webhookUrl || !secret || !recipients) return;

  const baseUrl = siteUrl();
  const quoteId = quote._id.toString();
  const quoteNumber = quote.quoteNumber || quote.reference || quoteId;
  const pdfUrl = baseUrl && quote.pdfAccessToken ? `${baseUrl}/api/quotes/pdf/${quoteId}?token=${quote.pdfAccessToken}` : undefined;
  const adminUrl = baseUrl ? `${baseUrl}/admin/quotes` : undefined;
  const subject = `${eventLabels[event]}: ${quoteNumber} - ${customer.name} ${customer.surname}`;

  const lines = [
    eventLabels[event],
    "",
    `Quote: ${quoteNumber}`,
    `Status: ${quote.status}`,
    `Total: ${formatCurrency(quote.totalAmount)}`,
    "",
    `Customer: ${customer.name} ${customer.surname}`,
    `Email: ${customer.email}`,
    `Phone: ${customer.phone}`,
    customer.companyName ? `Company: ${customer.companyName}` : undefined,
    "",
    `Address: ${property?.address || "Not specified"}`,
    property?.propertyType ? `Property type: ${property.propertyType}` : undefined,
    "",
    "Measured areas:",
    areaSummary(quote) || "None",
    "",
    quote.notes ? `Notes: ${quote.notes}` : undefined,
    pdfUrl ? `PDF: ${pdfUrl}` : undefined,
    adminUrl ? `Admin: ${adminUrl}` : undefined,
  ].filter(Boolean);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        recipients,
        subject,
        event,
        quoteId,
        quoteNumber,
        status: quote.status,
        totalAmount: quote.totalAmount,
        currency: quote.currency,
        customer: {
          name: customer.name,
          surname: customer.surname,
          email: customer.email,
          phone: customer.phone,
          companyName: customer.companyName,
        },
        property: {
          address: property?.address,
          propertyType: property?.propertyType,
        },
        areas: quote.areas,
        pdfUrl,
        adminUrl,
        text: lines.join("\n"),
      }),
    });

    if (!response.ok) {
      console.error("Google quote notification failed", response.status, await response.text());
    }
  } catch (error) {
    console.error("Google quote notification failed", error);
  }
}
