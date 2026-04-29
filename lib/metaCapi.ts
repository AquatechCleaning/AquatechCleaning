import crypto from "crypto";

type MetaServerEvent = {
  eventName: "QuoteGenerated" | "QuoteAccepted";
  eventId?: string;
  request: Request;
  sourceUrl?: string;
  fbp?: string;
  fbc?: string;
  email?: string;
  phone?: string;
  value?: number;
  currency?: string;
  quoteId?: string;
  quoteNumber?: string;
};

const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || "9518355421594109";
const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
const testEventCode = process.env.META_CAPI_TEST_EVENT_CODE;

const hash = (value?: string) => {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return undefined;

  return crypto.createHash("sha256").update(normalized).digest("hex");
};

export const sendMetaServerEvent = async (event: MetaServerEvent) => {
  if (!accessToken) return;

  const userData: Record<string, string | undefined> = {
    em: hash(event.email),
    ph: hash(event.phone?.replace(/[^\d+]/g, "")),
    fbp: event.fbp,
    fbc: event.fbc,
    client_ip_address: event.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    client_user_agent: event.request.headers.get("user-agent") ?? undefined,
  };

  Object.keys(userData).forEach((key) => {
    if (!userData[key]) delete userData[key];
  });

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: event.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        action_source: "website",
        event_source_url: event.sourceUrl,
        user_data: userData,
        custom_data: {
          currency: event.currency ?? "ZAR",
          value: event.value,
          quote_id: event.quoteId,
          quote_number: event.quoteNumber,
        },
      },
    ],
  };

  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  try {
    await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Meta CAPI event failed", error);
  }
};
