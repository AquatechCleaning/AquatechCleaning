"use client";

export type MetaEventName = "MeasurementStarted" | "QuoteGenerated" | "QuoteAccepted";

type EventOptions = {
  eventId?: string;
  customData?: Record<string, unknown>;
};

type AttributionData = {
  fbp?: string;
  fbc?: string;
  sourceUrl?: string;
  utm?: Record<string, string>;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid"];
const STORAGE_KEY = "aquatech_attribution";
const CONSENT_KEY = "aquatech_cookie_consent";
const MAX_TRACK_ATTEMPTS = 10;

export const hasAdvertisingConsent = () => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CONSENT_KEY) === "accepted";
};

export const createMetaEventId = (eventName: MetaEventName) => {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${eventName}-${random}`;
};

const getCookie = (name: string) => {
  if (typeof document === "undefined") return undefined;
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return value ? decodeURIComponent(value) : undefined;
};

export const captureAttribution = () => {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const attribution: Record<string, string> = {};

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) attribution[key] = value;
  });

  if (Object.keys(attribution).length > 0) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  }
};

export const getMetaAttribution = (): AttributionData => {
  if (typeof window === "undefined") return {};

  let utm: Record<string, string> | undefined;
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (stored) {
    try {
      utm = JSON.parse(stored) as Record<string, string>;
    } catch {
      utm = undefined;
    }
  }

  return {
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
    sourceUrl: window.location.href,
    utm,
  };
};

export const trackMetaEvent = (eventName: MetaEventName, options: EventOptions = {}, attempt = 0) => {
  if (
    typeof window === "undefined" ||
    !hasAdvertisingConsent()
  ) {
    return;
  }

  if (typeof window.fbq !== "function") {
    if (attempt < MAX_TRACK_ATTEMPTS) {
      window.setTimeout(() => trackMetaEvent(eventName, options, attempt + 1), 250);
    }
    return;
  }

  window.fbq("trackCustom", eventName, options.customData ?? {}, { eventID: options.eventId });
};
