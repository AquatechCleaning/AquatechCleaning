"use client";

import { useMemo, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, DrawingManager, Autocomplete, Polyline } from "@react-google-maps/api";

type AreaType = "roof" | "gutters" | "driveway" | "tiles" | "wall" | "house_wash" | "miscellaneous" | "windows" | "solar_panels";
type AreaEntry = { id: string; type: AreaType; sqm: number; details?: string };
type MeasuredArea = AreaEntry & { perimeter?: number };
type QuoteResult = { quoteId: string; quoteNumber?: string; totalAmount: number; lineItems: any[]; vatIncluded?: boolean; vatRate?: number; vatAmount?: number };

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

const libraries: any[] = ["drawing", "geometry", "places"];
const MAPS_LOADER_ID = "aquatech-maps";
const defaultCenter = { lat: -33.918861, lng: 18.4233 };

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

  const [roofStoreys, setRoofStoreys] = useState("single");
  const [gutterStoreys, setGutterStoreys] = useState("single");
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
      case "roof": return { details: `Storeys: ${roofStoreys}` };
      case "gutters": return { details: `Storeys: ${gutterStoreys}` };
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

  const { isLoaded } = useJsApiLoader({ id: MAPS_LOADER_ID, googleMapsApiKey: apiKey, libraries });

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

  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    const path = polygon.getPath();
    const sqm = Math.round(google.maps.geometry.spherical.computeArea(path));
    const { details, overrideValue } = buildDetails();
    const entry: MeasuredArea = { id: crypto.randomUUID(), type: activeType, sqm: overrideValue ?? sqm, details };
    setAreas((prev) => [...prev, entry]);
    drawnShapesRef.current.push(polygon);
    setIsMeasuring(false);
  };

  const handlePolylineComplete = (polyline: google.maps.Polyline) => {
    const path = polyline.getPath();
    let length = 0;
    for (let i = 0; i < path.getLength() - 1; i++) {
      length += google.maps.geometry.spherical.computeDistanceBetween(path.getAt(i), path.getAt(i + 1));
    }
    const { details, overrideValue } = buildDetails();
    const entry: MeasuredArea = { id: crypto.randomUUID(), type: activeType, sqm: overrideValue ?? Math.round(length), perimeter: Math.round(length), details };
    setAreas((prev) => [...prev, entry]);
    drawnShapesRef.current.push(polyline);
    setIsMeasuring(false);
  };

  const addManual = () => {
    const val = Number(manualSqm);
    if (!val || val <= 0) return;
    const { details } = buildDetails();
    setAreas((prev) => [...prev, { id: crypto.randomUUID(), type: activeType, sqm: val, details }]);
    setManualSqm("");
  };

  const removeArea = (id: string) => setAreas((prev) => prev.filter((a) => a.id !== id));

  const submitQuote = async () => {
    if (areas.length === 0) { setQuoteStatus("error"); setQuoteMessage("Please add at least one area."); return; }
    if (!form.name || !form.surname || !form.email || !form.phone) { setQuoteStatus("error"); setQuoteMessage("Please fill in all required contact fields."); return; }

    setQuoteStatus("idle");
    setQuoteMessage("");

    const payload = {
      ...form,
      address: address || "Not specified",
      coordinates,
      areas: areas.map((a) => ({ type: a.type, sqm: a.sqm, details: a.details })),
    };

    try {
      const res = await fetch("/api/quotes/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setQuoteResult(data);
      setQuoteStatus("success");
      setQuoteMessage(`Quote #${data.quoteNumber ?? data.quoteId} submitted!`);
    } catch (e: any) {
      setQuoteStatus("error");
      setQuoteMessage(e.message ?? "Something went wrong.");
    }
  };

  const drawingMode = useMemo(() => {
    const unit = unitFor(activeType);
    if (unit === "m") return "polyline";
    if (unit === "units") return null;
    return "polygon";
  }, [activeType]);

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

  if (quoteStatus === "success" && quoteResult) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div className="ui-card reveal-up" style={{ padding: "48px", maxWidth: "520px", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>✅</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 800, color: "var(--navy)", marginBottom: "10px" }}>
            Quote Submitted!
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.7, marginBottom: "28px" }}>
            Your quote #{quoteResult.quoteNumber ?? quoteResult.quoteId} has been received. We&apos;ll review and get back to you within 1 business day.
          </p>
          <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Estimated Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 800, color: "var(--primary)" }}>
                R{quoteResult.totalAmount.toLocaleString()}
              </span>
            </div>
            {quoteResult.vatIncluded && (
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", textAlign: "right" }}>
                Incl. VAT ({((quoteResult.vatRate ?? 0.15) * 100).toFixed(0)}%)
              </p>
            )}
          </div>
          <a href="/" className="ui-btn ui-btn-primary" style={{ display: "block", marginBottom: "10px" }}>← Back to Home</a>
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

      <div className="ui-container pg-body" style={{ padding: "40px 24px" }}>
        <div className="rsp-grid-quote" style={{ gap: "24px", alignItems: "start" }}>
          {/* Map column */}
          <div>
            {/* Service type picker */}
            <div className="ui-card" style={{ padding: "16px", marginBottom: "16px" }}>
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
                    onLoad={(m) => {
                      mapRef.current = m;
                      m.setMapTypeId("hybrid");
                    }}
                    options={{
                      mapTypeId: "hybrid",
                      disableDefaultUI: false,
                      mapTypeControl: true,
                      streetViewControl: false,
                    }}
                  >
                    {isMeasuring && drawingMode && (
                      <DrawingManager
                        onLoad={(dm) => { drawingManagerRef.current = dm; }}
                        onPolygonComplete={handlePolygonComplete}
                        onPolylineComplete={handlePolylineComplete}
                        drawingMode={drawingMode as any}
                        options={{
                          drawingControl: false,
                          polygonOptions: { fillColor: "#f0a935", fillOpacity: 0.35, strokeColor: "#02203d", strokeWeight: 2 },
                          polylineOptions: { strokeColor: "#f0a935", strokeWeight: 3 },
                        }}
                      />
                    )}
                  </GoogleMap>
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
                    onClick={() => setIsMeasuring(!isMeasuring)}
                  >
                    {isMeasuring ? "⏹ Stop Drawing" : `✏️ Draw ${serviceTypes.find((s) => s.type === activeType)?.label}`}
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
                      key={a.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        background: "var(--surface-2)",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        fontSize: "12px",
                      }}
                    >
                      <div>
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
            <div className="ui-card" style={{ padding: "20px" }}>
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
              <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", marginTop: "10px" }}>
                We confirm within 1 business day · No obligation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
