"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, DrawingManager, Autocomplete, OverlayView, Polygon, Polyline } from "@react-google-maps/api";
import { formatCurrency } from "@/lib/format";
import { captureAttribution, createMetaEventId, getMetaAttribution, hasAdvertisingConsent, trackMetaEvent } from "@/lib/metaPixel";

type AreaType = "roof" | "gutters" | "driveway" | "tiles" | "wall" | "house_wash" | "miscellaneous" | "windows" | "solar_panels";
type ShapePoint = { lat: number; lng: number };
type AreaEntry = { id: string; type: AreaType; sqm: number; details?: string; path?: ShapePoint[]; shape?: "polygon" | "polyline" | "manual" };
type MeasuredArea = AreaEntry & { perimeter?: number };
type QuoteResult = { quoteId: string; quoteNumber?: string; pdfAccessToken?: string; totalAmount: number; lineItems: any[]; vatIncluded?: boolean; vatRate?: number; vatAmount?: number };

const measurementUnits: Record<AreaType, "m2" | "m" | "units"> = {
  roof: "m2", gutters: "m", driveway: "m2", tiles: "m2", wall: "m",
  house_wash: "m", miscellaneous: "m2", windows: "units", solar_panels: "units",
};
const unitFor = (type: AreaType) => measurementUnits[type] || "m2";

const serviceTypes: { type: AreaType; label: string; icon: string }[] = [
  { type: "roof", label: "Roof", icon: "🏠" },
  { type: "gutters", label: "Gutters", icon: "🌿" },
  { type: "driveway", label: "Driveway", icon: "🛣️" },
  { type: "tiles", label: "Tiles", icon: "🔲" },
  { type: "wall", label: "Walls", icon: "🏗️" },
  { type: "house_wash", label: "House Wash", icon: "🚿" },
  { type: "windows", label: "Windows", icon: "🪟" },
  { type: "solar_panels", label: "Solar", icon: "☀️" },
  { type: "miscellaneous", label: "Other", icon: "⚙️" },
];

const tutorialSteps = [
  {
    title: "Find the property",
    body: "Search the address, then zoom in until the roof, paving, walls, or other surfaces are easy to see.",
  },
  {
    title: "Choose the service",
    body: "Pick the surface type before drawing. Gutters and walls use metres, roofs and paving use square metres, and windows or solar panels use counts.",
  },
  {
    title: "Draw or enter manually",
    body: "Press Draw, click around the surface on the map, then close the shape. Use manual entry when the map is unclear.",
  },
  {
    title: "Review and submit",
    body: "Check the measured areas, remove anything incorrect, add your details, and submit the quote request.",
  },
];

const libraries: any[] = ["drawing", "geometry", "places"];
const MAPS_LOADER_ID = "aquatech-maps";
const defaultCenter = { lat: -33.918861, lng: 18.4233 };
const MOBILE_CLOSE_THRESHOLD_PIXELS = 44;
const createClientId = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export default function QuotePage() {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [areas, setAreas] = useState<MeasuredArea[]>([]);
  const [activeType, setActiveType] = useState<AreaType>("roof");
  const [manualSqm, setManualSqm] = useState("");
  const [form, setForm] = useState({ name: "", surname: "", email: "", phone: "", propertyType: "residential" as "residential" | "commercial", companyName: "", companyRegNumber: "", vatNumber: "", notes: "" });
  const [quoteResult, setQuoteResult] = useState<QuoteResult>();
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState<"idle" | "success" | "error">("idle");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [quoteActionStatus, setQuoteActionStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [quoteActionMessage, setQuoteActionMessage] = useState("");
  const [quoteActionComplete, setQuoteActionComplete] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [showTutorial, setShowTutorial] = useState(true);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [mobilePolygonPoints, setMobilePolygonPoints] = useState<ShapePoint[]>([]);
  const [lastAddedArea, setLastAddedArea] = useState<MeasuredArea | null>(null);

  const [drivewayMaterial, setDrivewayMaterial] = useState("");
  const [drivewayRepoint, setDrivewayRepoint] = useState(false);
  const [tileMaterial, setTileMaterial] = useState("");
  const [wallSides, setWallSides] = useState<"one" | "both">("one");
  const [miscLabel, setMiscLabel] = useState("");
  const [windowCount, setWindowCount] = useState("");
  const [solarCount, setSolarCount] = useState("");

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const hasValidKey = Boolean(apiKey && apiKey !== "your-google-maps-api-key");

  const buildDetails = (): { details?: string; overrideValue?: number } => {
    switch (activeType) {
      case "roof": return {};
      case "gutters": return {};
      case "driveway": return { details: [drivewayMaterial, drivewayRepoint ? "Repoint" : ""].filter(Boolean).join(", ") || undefined };
      case "tiles": return { details: tileMaterial || undefined };
      case "wall": return { details: `Sides: ${wallSides}` };
      case "miscellaneous": return { details: miscLabel || undefined };
      case "windows": return { overrideValue: Number(windowCount) || 0 };
      case "solar_panels": return { overrideValue: Number(solarCount) || 0 };
      default: return {};
    }
  };

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawnShapesRef = useRef<google.maps.MVCObject[]>([]);
  const measurementStartedRef = useRef(false);
  const surfacePickerRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const mobileCloseInProgressRef = useRef(false);

  const { isLoaded } = useJsApiLoader({ id: MAPS_LOADER_ID, googleMapsApiKey: apiKey, libraries });

  useEffect(() => {
    captureAttribution();
  }, []);

  useEffect(() => {
    const syncViewport = () => {
      setIsMobileViewport(window.matchMedia("(max-width: 768px), (pointer: coarse)").matches);
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const trackMeasurementStarted = (entryMethod: "map" | "manual") => {
    if (measurementStartedRef.current) return;

    measurementStartedRef.current = true;
    trackMetaEvent("MeasurementStarted", {
      eventId: createMetaEventId("MeasurementStarted"),
      customData: {
        surface_type: activeType,
        entry_method: entryMethod,
      },
    });
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.geometry?.location) return;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setAddress(place.formatted_address ?? "");
    setCoordinates({ lat, lng });
    mapRef.current?.panTo({ lat, lng });
    mapRef.current?.setZoom(19);
  };

  const buildPolygonEntry = (points: ShapePoint[]): MeasuredArea => {
    const path = points.map((point) => new google.maps.LatLng(point.lat, point.lng));
    const sqm = Math.round(google.maps.geometry.spherical.computeArea(path));
    const { details, overrideValue } = buildDetails();

    return {
      id: createClientId(),
      type: activeType,
      sqm: overrideValue ?? sqm,
      details,
      path: points,
      shape: "polygon",
    };
  };

  const addPolygonMeasurement = (points: ShapePoint[], overlay: google.maps.Polygon) => {
    const entry = buildPolygonEntry(points);
    setAreas((prev) => [...prev, entry]);
    setLastAddedArea(entry);
    overlay.setOptions({ clickable: false });
    drawnShapesRef.current.push(overlay);
    setIsMeasuring(false);
  };

  const clearCompletedPolygonFills = () => {
    if (!window.google?.maps) return;

    drawnShapesRef.current.forEach((shape) => {
      if (shape instanceof google.maps.Polygon) {
        shape.setOptions({ fillOpacity: 0, clickable: false });
      }
    });
  };

  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    const points: ShapePoint[] = polygon.getPath().getArray().map((point) => ({ lat: point.lat(), lng: point.lng() }));
    addPolygonMeasurement(points, polygon);
  };

  const getMobileCloseDistanceMeters = (firstPoint: ShapePoint) => {
    const zoom = mapRef.current?.getZoom() ?? 19;
    const metersPerPixel = (156543.03392 * Math.cos((firstPoint.lat * Math.PI) / 180)) / 2 ** zoom;
    return Math.min(18, Math.max(5, metersPerPixel * MOBILE_CLOSE_THRESHOLD_PIXELS));
  };

  const isCloseToFirstPoint = (point: ShapePoint, firstPoint: ShapePoint) => {
    if (!window.google?.maps?.geometry || !mapRef.current) return false;

    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(point.lat, point.lng),
      new google.maps.LatLng(firstPoint.lat, firstPoint.lng)
    );

    return distance <= getMobileCloseDistanceMeters(firstPoint);
  };

  const saveMobilePolygon = (points: ShapePoint[]) => {
    if (!mapRef.current || points.length < 3) return;

    const polygon = new google.maps.Polygon({
      paths: points,
      fillColor: "#f0a935",
      fillOpacity: 0.35,
      strokeColor: "#02203d",
      strokeWeight: 2,
      clickable: false,
      map: mapRef.current,
    });

    addPolygonMeasurement(points, polygon);
    setMobilePolygonPoints([]);
  };

  const closeMobilePolygonFromPointOne = () => {
    if (mobilePolygonPoints.length < 3) return;
    if (mobileCloseInProgressRef.current) return;
    mobileCloseInProgressRef.current = true;
    saveMobilePolygon(mobilePolygonPoints);
  };

  const handleMobilePolygonClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const point = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    if (mobilePolygonPoints.length >= 3 && isCloseToFirstPoint(point, mobilePolygonPoints[0])) {
      saveMobilePolygon(mobilePolygonPoints);
      return;
    }

    setMobilePolygonPoints((prev) => [...prev, point]);
  };

  const handlePolylineComplete = (polyline: google.maps.Polyline) => {
    const path = polyline.getPath();
    let length = 0;
    for (let i = 0; i < path.getLength() - 1; i++) {
      length += google.maps.geometry.spherical.computeDistanceBetween(path.getAt(i), path.getAt(i + 1));
    }
    const { details, overrideValue } = buildDetails();
    const points: ShapePoint[] = path.getArray().map((point) => ({ lat: point.lat(), lng: point.lng() }));
    const entry: MeasuredArea = { id: createClientId(), type: activeType, sqm: overrideValue ?? Math.round(length), perimeter: Math.round(length), details, path: points, shape: "polyline" };
    setAreas((prev) => [...prev, entry]);
    setLastAddedArea(entry);
    drawnShapesRef.current.push(polyline);
    setIsMeasuring(false);
  };

  const addManual = () => {
    const val = Number(manualSqm);
    if (!val || val <= 0) return;
    trackMeasurementStarted("manual");
    const { details } = buildDetails();
    const entry: MeasuredArea = { id: createClientId(), type: activeType, sqm: val, details, shape: "manual" };
    setAreas((prev) => [...prev, entry]);
    setLastAddedArea(entry);
    setManualSqm("");
  };

  const removeArea = (id: string) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
    setLastAddedArea((prev) => (prev?.id === id ? null : prev));
  };

  const measurementLabel = (area: MeasuredArea) => {
    const service = serviceTypes.find((s) => s.type === area.type)?.label ?? area.type.replace("_", " ");
    const unit = unitFor(area.type);
    const measureType = unit === "m" ? "distance" : unit === "units" ? "quantity" : "area";
    return `${service} ${measureType}: ${area.sqm} ${unit}`;
  };

  const scrollToSurfacePicker = () => {
    clearCompletedPolygonFills();
    setLastAddedArea(null);
    surfacePickerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToDetails = () => {
    setLastAddedArea(null);
    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitQuote = async () => {
    if (areas.length === 0) { setQuoteStatus("error"); setQuoteMessage("Please add at least one area."); return; }
    if (!form.name || form.name.trim().length < 2) { setQuoteStatus("error"); setQuoteMessage("Please enter your first name (at least 2 characters)."); return; }
    if (!form.surname || form.surname.trim().length < 2) { setQuoteStatus("error"); setQuoteMessage("Please enter your last name (at least 2 characters)."); return; }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setQuoteStatus("error"); setQuoteMessage("Please enter a valid email address."); return; }
    if (!form.phone || form.phone.trim().length < 6) { setQuoteStatus("error"); setQuoteMessage("Please enter a valid phone number."); return; }
    if (form.propertyType === "commercial" && !form.companyName?.trim()) { setQuoteStatus("error"); setQuoteMessage("Please enter your company name for commercial quotes."); return; }

    setQuoteStatus("idle");
    setQuoteMessage("");

    const quoteGeneratedEventId = createMetaEventId("QuoteGenerated");
    const attribution = getMetaAttribution();
    const advertisingConsent = hasAdvertisingConsent();

    const payload = {
      ...form,
      name: form.name.trim(),
      surname: form.surname.trim(),
      address: address?.trim() || "Not specified",
      coordinates,
      areas: areas.map((a) => ({ type: a.type, sqm: a.sqm, details: a.details, path: a.path, shape: a.shape })),
      meta: {
        eventId: quoteGeneratedEventId,
        fbp: attribution.fbp,
        fbc: attribution.fbc,
        sourceUrl: attribution.sourceUrl,
        consent: advertisingConsent,
      },
      utm: attribution.utm,
    };

    try {
      const res = await fetch("/api/quotes/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) {
        const detail = data.details || data.error || "Failed to submit quote.";
        throw new Error(detail);
      }
      setQuoteResult(data);
      setQuoteStatus("success");
      setQuoteMessage(`Quote #${data.quoteNumber ?? data.quoteId} submitted!`);
      trackMetaEvent("QuoteGenerated", {
        eventId: quoteGeneratedEventId,
        customData: {
          currency: "ZAR",
          value: data.totalAmount,
          quote_id: data.quoteId,
          quote_number: data.quoteNumber,
        },
      });
    } catch (e: any) {
      setQuoteStatus("error");
      setQuoteMessage(e.message ?? "Something went wrong. Please try again.");
    }
  };

  const drawingMode = useMemo(() => {
    const unit = unitFor(activeType);
    if (unit === "m") return "polyline";
    if (unit === "units") return null;
    return "polygon";
  }, [activeType]);
  const isMobilePolygonMode = isMobileViewport && isMeasuring && drawingMode === "polygon";

  useEffect(() => {
    if (!isMeasuring || drawingMode !== "polygon" || !isMobileViewport) {
      setMobilePolygonPoints([]);
    }
  }, [drawingMode, isMeasuring, isMobileViewport]);

  useEffect(() => {
    if (mobilePolygonPoints.length === 0 || !isMeasuring) {
      mobileCloseInProgressRef.current = false;
    }
  }, [isMeasuring, mobilePolygonPoints.length]);

  const inputStyle = {
    width: "100%",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "9px 12px",
    fontSize: "13px",
    fontFamily: "var(--font-body)",
    color: "var(--navy)",
    background: "var(--surface-2)",
  };
  const labelStyle = {
    display: "block",
    fontSize: "10px",
    fontWeight: 700 as const,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "var(--text-muted)",
    marginBottom: "4px",
  };

  const handleQuoteAction = async (action: "accept" | "decline" | "callback") => {
    if (!quoteResult?.quoteId) return;

    setQuoteActionStatus("loading");
    setQuoteActionMessage("");

    const endpoint =
      action === "accept"
        ? "/api/quotes/accept"
        : action === "decline"
          ? "/api/quotes/decline"
          : "/api/quotes/callback";

    try {
      const quoteAcceptedEventId = createMetaEventId("QuoteAccepted");
      const attribution = getMetaAttribution();
      const advertisingConsent = hasAdvertisingConsent();
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: quoteResult.quoteId,
          ...(action === "accept"
            ? {
                meta: {
                  eventId: quoteAcceptedEventId,
                  fbp: attribution.fbp,
                  fbc: attribution.fbc,
                  sourceUrl: attribution.sourceUrl,
                  consent: advertisingConsent,
                },
              }
            : {}),
          ...(action === "decline" ? { reason: declineReason.trim() || undefined } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to update quote.");

      setQuoteActionComplete(true);
      setQuoteActionStatus("success");
      setQuoteActionMessage(
        action === "accept"
          ? "Quote accepted. We will contact you to confirm scheduling."
          : action === "decline"
            ? "Quote declined. Thank you for letting us know."
            : "Callback requested. We will contact you shortly."
      );
      if (action === "accept") {
        trackMetaEvent("QuoteAccepted", {
          eventId: quoteAcceptedEventId,
          customData: {
            currency: "ZAR",
            value: quoteResult.totalAmount,
            quote_id: quoteResult.quoteId,
            quote_number: quoteResult.quoteNumber,
          },
        });
      }
    } catch (e: any) {
      setQuoteActionStatus("error");
      setQuoteActionMessage(e.message ?? "Unable to update quote. Please try again.");
    }
  };

  if (quoteStatus === "success" && quoteResult) {
    return (
      <div className="quote-result-shell" style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="ui-card reveal-up quote-result-card">
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>✅</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 800, color: "var(--navy)", marginBottom: "10px" }}>
            Quote Ready
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.7, marginBottom: "28px" }}>
            Review quote #{quoteResult.quoteNumber ?? quoteResult.quoteId}, then accept, decline, request a call back, or download a copy.
          </p>
          <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "28px" }}>
            <div className="quote-result-total-row">
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Estimated Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 800, color: "var(--primary)" }}>
                {formatCurrency(quoteResult.totalAmount)}
              </span>
            </div>
            {quoteResult.vatIncluded && (
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", textAlign: "right" }}>
                Incl. VAT ({((quoteResult.vatRate ?? 0.15) * 100).toFixed(0)}%)
              </p>
            )}
          </div>
          <div className="rsp-grid-actions" style={{ marginBottom: "10px" }}>
            <button
              className="ui-btn ui-btn-primary"
              onClick={() => handleQuoteAction("accept")}
              disabled={quoteActionStatus === "loading" || quoteActionComplete}
            >
              Accept Quote
            </button>
            <button
              className="ui-btn ui-btn-ghost"
              onClick={() => handleQuoteAction("decline")}
              disabled={quoteActionStatus === "loading" || quoteActionComplete}
            >
              Decline Quote
            </button>
          </div>
          <div className="rsp-grid-actions" style={{ marginBottom: "14px" }}>
            <button
              className="ui-btn ui-btn-secondary"
              onClick={() => handleQuoteAction("callback")}
              disabled={quoteActionStatus === "loading" || quoteActionComplete}
            >
              Request Call Back
            </button>
            <a
              href={`/api/quotes/pdf/${quoteResult.quoteId}${quoteResult.pdfAccessToken ? `?token=${quoteResult.pdfAccessToken}` : ""}`}
              className="ui-btn ui-btn-ghost"
              style={{ display: "block", textDecoration: "none" }}
            >
              Download Quote
            </a>
          </div>
          <textarea
            style={{ ...inputStyle, resize: "vertical", marginBottom: "12px" }}
            rows={2}
            placeholder="Optional reason if declining"
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          />
          {quoteActionMessage && (
            <div
              style={{
                background: quoteActionStatus === "error" ? "#FEE2E2" : "#ECFDF5",
                border: `1px solid ${quoteActionStatus === "error" ? "#FECACA" : "#A7F3D0"}`,
                borderRadius: "8px",
                color: quoteActionStatus === "error" ? "#991b1b" : "#065F46",
                fontSize: "12px",
                marginBottom: "12px",
                padding: "10px 14px",
              }}
            >
              {quoteActionMessage}
            </div>
          )}
          <a href="/quote" className="ui-btn ui-btn-ghost" style={{ display: "block" }}>Submit Another Quote</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="page-hero" style={{ background: "var(--navy)", padding: "48px 0 64px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div className="ui-container" style={{ position: "relative" }}>
          <p className="ui-kicker" style={{ color: "var(--accent)" }}>Instant Quoting</p>
          <h1 className="ui-title reveal-up" style={{ color: "#fff", marginTop: "8px", marginBottom: "10px" }}>
            Draw your area, get a price
          </h1>
          <p className="ui-subtitle reveal-up reveal-up-d1" style={{ color: "rgba(255,255,255,0.65)", maxWidth: "480px" }}>
            Use the map to measure your surfaces. We calculate the area and price it instantly.
          </p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40px", background: "var(--bg)", clipPath: "ellipse(60% 100% at 50% 100%)" }} />
      </div>

      <div className="ui-container pg-body quote-page-container" style={{ padding: "40px 24px" }}>
        {showTutorial && (
          <div className="ui-card reveal-up" style={{ padding: "24px", marginBottom: "24px", borderColor: "rgba(240,169,53,0.35)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "18px" }}>
              <div>
                <p style={labelStyle}>Quick tutorial</p>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 800, color: "var(--navy)", margin: 0 }}>
                  How to build your quote
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowTutorial(false)}
                aria-label="Hide tutorial"
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  background: "#fff",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "8px 10px",
                  whiteSpace: "nowrap",
                }}
              >
                Hide
              </button>
            </div>
            <div className="rsp-grid-form-2" style={{ gap: "12px" }}>
              {tutorialSteps.map((step, index) => (
                <div
                  key={step.title}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "34px 1fr",
                    gap: "12px",
                    alignItems: "start",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "8px",
                      background: index === 0 ? "var(--primary)" : "var(--navy)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: 800,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 800, color: "var(--navy)", margin: "0 0 4px" }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!showTutorial && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
            <button
              type="button"
              className="ui-btn ui-btn-ghost"
              onClick={() => setShowTutorial(true)}
              style={{ padding: "9px 14px", fontSize: "12px" }}
            >
              Show tutorial
            </button>
          </div>
        )}

        <div className="rsp-grid-quote" style={{ gap: "24px", alignItems: "start" }}>
          {/* Map column */}
          <div className="quote-map-column">
            {/* Service type picker */}
            <div ref={surfacePickerRef} className="ui-card" style={{ padding: "16px", marginBottom: "16px", scrollMarginTop: "18px" }}>
              <p style={labelStyle}>Select surface type to measure</p>
              <div className="pills-rsp" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {serviceTypes.map((s) => (
                  <button
                    key={s.type}
                    onClick={() => setActiveType(s.type)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      border: "1px solid var(--border)",
                      background: activeType === s.type ? "var(--primary)" : "#fff",
                      color: activeType === s.type ? "#fff" : "var(--text-muted)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Map */}
            <div
              className="map-rsp"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid var(--border)",
                height: "420px",
                background: "#e2eaf2",
                position: "relative",
              }}
            >
              {!hasValidKey ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "12px" }}>
                  <div style={{ fontSize: "32px" }}>🗺️</div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "var(--navy)" }}>Google Maps</p>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", maxWidth: "280px" }}>
                    Add your <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>.env</code> to enable the map.
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Use the manual entry below in the meantime.</p>
                </div>
              ) : isLoaded ? (
                <>
                  <div style={{ position: "absolute", top: "12px", left: "12px", right: "12px", zIndex: 10 }}>
                    <Autocomplete
                      onLoad={(a) => { autocompleteRef.current = a; }}
                      onPlaceChanged={handlePlaceChanged}
                      options={{ componentRestrictions: { country: "za" } }}
                    >
                      <input
                        style={{ ...inputStyle, boxShadow: "var(--shadow-md)", background: "rgba(255,255,255,0.97)" }}
                        placeholder="Search your property address…"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Autocomplete>
                  </div>
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={coordinates ?? defaultCenter}
                    zoom={coordinates ? 19 : 12}
                    mapTypeId="hybrid"
                    onClick={isMobilePolygonMode ? handleMobilePolygonClick : undefined}
                    onLoad={(m) => {
                      mapRef.current = m;
                      m.setMapTypeId("hybrid");
                    }}
                    options={{
                      mapTypeId: "hybrid",
                      disableDefaultUI: false,
                      mapTypeControl: true,
                      streetViewControl: false,
                      clickableIcons: !isMobilePolygonMode,
                    }}
                  >
                    {isMeasuring && drawingMode && !isMobilePolygonMode && (
                      <DrawingManager
                        onLoad={(dm) => { drawingManagerRef.current = dm; }}
                        onPolygonComplete={handlePolygonComplete}
                        onPolylineComplete={handlePolylineComplete}
                        drawingMode={drawingMode as any}
                        options={{
                          drawingControl: false,
                          polygonOptions: { fillColor: "#f0a935", fillOpacity: 0.35, strokeColor: "#02203d", strokeWeight: 2, clickable: false },
                          polylineOptions: { strokeColor: "#f0a935", strokeWeight: 3, clickable: false },
                        }}
                      />
                    )}
                    {isMobilePolygonMode && mobilePolygonPoints.length > 0 && (
                      <>
                        <Polyline
                          path={mobilePolygonPoints}
                          options={{
                            strokeColor: "#f0a935",
                            strokeWeight: 3,
                            clickable: false,
                          }}
                        />
                        {mobilePolygonPoints.length > 2 && (
                          <Polygon
                            paths={mobilePolygonPoints}
                            options={{
                              fillColor: "#f0a935",
                              fillOpacity: 0.2,
                              strokeColor: "#02203d",
                              strokeWeight: 2,
                              clickable: false,
                            }}
                          />
                        )}
                        {mobilePolygonPoints.map((point, index) => {
                          const canClose = index === 0 && mobilePolygonPoints.length >= 3;

                          return (
                            <OverlayView
                              key={`${point.lat}-${point.lng}-${index}`}
                              position={point}
                              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                            >
                              <button
                                type="button"
                                aria-label={canClose ? "Close shape" : `Point ${index + 1}`}
                                onPointerDown={(event) => {
                                  if (!canClose) return;
                                  event.preventDefault();
                                  event.stopPropagation();
                                  closeMobilePolygonFromPointOne();
                                }}
                                onMouseDown={(event) => {
                                  if (!canClose) return;
                                  event.preventDefault();
                                  event.stopPropagation();
                                  closeMobilePolygonFromPointOne();
                                }}
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  if (canClose) closeMobilePolygonFromPointOne();
                                }}
                                onTouchEnd={(event) => {
                                  if (!canClose) return;
                                  event.preventDefault();
                                  event.stopPropagation();
                                  closeMobilePolygonFromPointOne();
                                }}
                                style={{
                                  width: canClose ? "44px" : "30px",
                                  height: canClose ? "44px" : "30px",
                                  borderRadius: "999px",
                                  border: "2px solid #02203d",
                                  background: canClose ? "#ffffff" : "#f0a935",
                                  color: "#02203d",
                                  fontSize: "12px",
                                  fontWeight: 800,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  transform: "translate(-50%, -50%)",
                                  boxShadow: "0 2px 8px rgba(2,32,61,0.25)",
                                  cursor: canClose ? "pointer" : "default",
                                  padding: 0,
                                  pointerEvents: canClose ? "auto" : "none",
                                  touchAction: "none",
                                  position: "relative",
                                  zIndex: canClose ? 1000 : 1,
                                }}
                              >
                                {index + 1}
                              </button>
                            </OverlayView>
                          );
                        })}
                      </>
                    )}
                  </GoogleMap>
                  {lastAddedArea && (
                    <div
                      style={{
                        position: "absolute",
                        left: "12px",
                        right: "12px",
                        bottom: "12px",
                        zIndex: 30,
                        background: "rgba(255,255,255,0.97)",
                        border: "1px solid rgba(2,32,61,0.12)",
                        borderRadius: "10px",
                        boxShadow: "0 12px 30px rgba(2,32,61,0.2)",
                        padding: "12px",
                      }}
                    >
                      <p style={{ fontSize: "10px", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", marginBottom: "4px" }}>
                        Added to Quote
                      </p>
                      <p style={{ fontSize: "13px", fontWeight: 800, color: "var(--navy)", marginBottom: "10px" }}>
                        {measurementLabel(lastAddedArea)}
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <button
                          type="button"
                          className="ui-btn ui-btn-ghost"
                          style={{ padding: "9px 10px", fontSize: "12px" }}
                          onClick={scrollToSurfacePicker}
                        >
                          Add Another Surface
                        </button>
                        <button
                          type="button"
                          className="ui-btn ui-btn-primary"
                          style={{ padding: "9px 10px", fontSize: "12px" }}
                          onClick={scrollToDetails}
                        >
                          Continue to Quote
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                  <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Loading map…</p>
                </div>
              )}
            </div>

            {/* Map actions */}
            {hasValidKey && (
              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {drawingMode && (
                  <button
                    className={`ui-btn ${isMeasuring ? "ui-btn-secondary" : "ui-btn-primary"}`}
                    style={{ width: "100%" }}
                    onClick={() => {
                      if (!isMeasuring) {
                        clearCompletedPolygonFills();
                        trackMeasurementStarted("map");
                      }
                      setIsMeasuring(!isMeasuring);
                    }}
                  >
                    {isMeasuring ? "Stop Drawing" : `Draw ${serviceTypes.find((s) => s.type === activeType)?.label}`}
                  </button>
                )}
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>Enter manually:</span>
                  <input
                    style={{ ...inputStyle, flex: 1, minWidth: 0 }}
                    type="number"
                    placeholder={`${unitFor(activeType) === "units" ? "Count" : unitFor(activeType) === "m" ? "Metres" : "m²"}`}
                    value={manualSqm}
                    onChange={(e) => setManualSqm(e.target.value)}
                  />
                  <button className="ui-btn ui-btn-ghost" style={{ flexShrink: 0 }} onClick={addManual} disabled={!manualSqm}>+ Add</button>
                </div>
              </div>
            )}

            {/* Manual entry fallback when no API key */}
            {!hasValidKey && (
              <div className="ui-card" style={{ padding: "20px", marginTop: "12px" }}>
                <p style={labelStyle}>Manual entry — {serviceTypes.find((s) => s.type === activeType)?.label}</p>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    type="number"
                    placeholder={`Enter ${unitFor(activeType) === "units" ? "count" : unitFor(activeType) === "m" ? "length in metres" : "area in m²"}`}
                    value={manualSqm}
                    onChange={(e) => setManualSqm(e.target.value)}
                  />
                  <button className="ui-btn ui-btn-primary" onClick={addManual} disabled={!manualSqm}>+ Add</button>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Measured areas */}
            <div className="ui-card" style={{ padding: "20px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--navy)", marginBottom: "12px" }}>
                📏 Measured Areas ({areas.length})
              </h3>
              {areas.length === 0 ? (
                <p style={{ fontSize: "12px", color: "var(--text-muted)", background: "var(--surface-2)", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
                  Draw on the map or enter manually. Areas appear here.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {areas.map((a) => (
                    <div
                      className="quote-area-item"
                      key={a.id}
                      style={{
                        padding: "8px 12px",
                        background: "var(--surface-2)",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        fontSize: "12px",
                      }}
                    >
                      <div className="quote-area-meta">
                        <span style={{ fontWeight: 600, color: "var(--navy)", textTransform: "capitalize" }}>{a.type.replace("_", " ")}</span>
                        <span style={{ color: "var(--text-muted)", marginLeft: "6px" }}>
                          {a.sqm} {unitFor(a.type)}
                        </span>
                        {a.details && <span style={{ color: "var(--text-soft)", marginLeft: "4px", fontSize: "11px" }}>· {a.details}</span>}
                      </div>
                      <button
                        onClick={() => removeArea(a.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", fontWeight: 700, fontSize: "14px", lineHeight: 1, padding: "2px 4px" }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact details */}
            <div ref={detailsRef} className="ui-card" style={{ padding: "20px", scrollMarginTop: "18px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--navy)", marginBottom: "14px" }}>
                👤 Your Details
              </h3>
              <div className="rsp-grid-form-2" style={{ gap: "10px" }}>
                <div>
                  <label style={labelStyle}>First Name *</label>
                  <input style={inputStyle} placeholder="John" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Last Name *</label>
                  <input style={inputStyle} placeholder="Smith" value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} required />
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <label style={labelStyle}>Email *</label>
                <input style={inputStyle} type="email" placeholder="john@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div style={{ marginTop: "10px" }}>
                <label style={labelStyle}>Phone *</label>
                <input style={inputStyle} placeholder="+27 82 000 0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div style={{ marginTop: "10px" }}>
                <label style={labelStyle}>Property Type</label>
                <select
                  style={inputStyle}
                  value={form.propertyType}
                  onChange={(e) => setForm({ ...form, propertyType: e.target.value as any })}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              {form.propertyType === "commercial" && (
                <>
                  <div style={{ marginTop: "10px" }}>
                    <label style={labelStyle}>Company Name *</label>
                    <input style={inputStyle} value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
                  </div>
                  <div className="rsp-grid-form-2" style={{ gap: "10px", marginTop: "10px" }}>
                    <div>
                      <label style={labelStyle}>Reg Number</label>
                      <input style={inputStyle} value={form.companyRegNumber} onChange={(e) => setForm({ ...form, companyRegNumber: e.target.value })} />
                    </div>
                    <div>
                      <label style={labelStyle}>VAT Number</label>
                      <input style={inputStyle} value={form.vatNumber} onChange={(e) => setForm({ ...form, vatNumber: e.target.value })} />
                    </div>
                  </div>
                </>
              )}
              <div style={{ marginTop: "10px" }}>
                <label style={labelStyle}>Notes</label>
                <textarea style={{ ...inputStyle, resize: "vertical" }} rows={2} placeholder="Any access info or special requirements…" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>

            {/* Submit */}
            <div className="ui-card" style={{ padding: "20px" }}>
              {quoteStatus === "error" && (
                <div style={{ background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#991b1b", marginBottom: "12px" }}>
                  {quoteMessage}
                </div>
              )}
              <button
                className="ui-btn ui-btn-primary"
                style={{ width: "100%", padding: "14px", fontSize: "15px" }}
                onClick={submitQuote}
                disabled={areas.length === 0}
              >
                Submit Quote Request →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
