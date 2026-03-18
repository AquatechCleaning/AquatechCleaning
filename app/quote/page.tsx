"use client";

import { useMemo, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, DrawingManager, Autocomplete, Polyline } from "@react-google-maps/api";

type AreaType =
  | "roof"
  | "gutters"
  | "driveway"
  | "tiles"
  | "wall"
  | "house_wash"
  | "miscellaneous"
  | "windows"
  | "solar_panels";

type AreaEntry = { id: string; type: AreaType; sqm: number; details?: string };
type MeasuredArea = AreaEntry & { perimeter?: number };

const measurementUnits: Record<AreaType, "m2" | "m" | "units"> = {
  roof: "m2",
  gutters: "m",
  driveway: "m2",
  tiles: "m2",
  wall: "m",
  house_wash: "m",
  miscellaneous: "m2",
  windows: "units",
  solar_panels: "units",
};

const unitFor = (type: AreaType) => measurementUnits[type] || "m2";

type QuoteResult = {
  quoteId: string;
  quoteNumber?: string;
  totalAmount: number;
  lineItems: any[];
  vatIncluded?: boolean;
  vatRate?: number;
  vatAmount?: number;
};

const libraries: (
  | "drawing"
  | "geometry"
  | "places"
  | "maps"
  | "marker"
  | "routes"
  | "streetView"
  | "visualization"
  | "core"
)[] = ["drawing", "geometry", "places"];

const defaultCenter = { lat: -33.918861, lng: 18.4233 };

export default function QuotePage() {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [areas, setAreas] = useState<MeasuredArea[]>([]);
  const [activeType, setActiveType] = useState<AreaType>("roof");
  const [manualSqm, setManualSqm] = useState("");
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    propertyType: "residential" as "residential" | "commercial",
    companyName: "",
    companyRegNumber: "",
    vatNumber: "",
    notes: "",
  });
  const [quoteResult, setQuoteResult] = useState<QuoteResult>();
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState<"idle" | "success" | "error">("idle");
  const [quoteMessage, setQuoteMessage] = useState("");

  // type-specific inputs
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
      case "roof":
        return { details: `Storeys: ${roofStoreys}` };
      case "gutters":
        return { details: `Storeys: ${gutterStoreys}` };
      case "driveway":
        return {
          details: `Material: ${drivewayMaterial || "N/A"}, Repointing: ${drivewayRepoint ? "Yes" : "No"}`,
        };
      case "tiles":
        return { details: `Tile material: ${tileMaterial || "N/A"}` };
      case "wall":
        return { details: `Sides: ${wallSides === "both" ? "Both sides" : "One side"}` };
      case "house_wash":
        return { details: "House wash" };
      case "miscellaneous":
        return { details: `Surface: ${miscLabel || "Miscellaneous"}` };
      case "windows": {
        const count = Number(windowCount) || 0;
        return { details: `Windows count: ${count}`, overrideValue: count };
      }
      case "solar_panels": {
        const count = Number(solarCount) || 0;
        return { details: `Solar panels count: ${count}`, overrideValue: count };
      }
      default:
        return {};
    }
  };

  const addArea = (value: number) => {
    const { details, overrideValue } = buildDetails();
    const effectiveValue = overrideValue && overrideValue > 0 ? overrideValue : value;
    const id = `${Date.now()}-${areas.length}`;
    setAreas((prev) => [...prev, { id, type: activeType, sqm: Number(effectiveValue.toFixed(1)), details }]);
  };

  const addManualArea = () => {
    const numeric = Number(manualSqm);
    if (!numeric || numeric <= 0) return;
    addArea(numeric);
    setManualSqm("");
  };

  const removeArea = (id: string) => setAreas((prev) => prev.filter((a) => a.id !== id));

  const validateQuote = () => {
    const issues: string[] = [];
    if (!form.name.trim()) issues.push("Name is required.");
    if (!form.surname.trim()) issues.push("Surname is required.");
    if (!form.email.trim()) issues.push("Email is required.");
    if (!form.phone.trim()) issues.push("Cell number is required.");
    if (!address.trim()) issues.push("Property address is required.");
    if (areas.length === 0) issues.push("Please draw or add at least one area.");
    if (form.propertyType === "commercial" && !form.companyName.trim()) {
      issues.push("Business name is required for commercial quotes.");
    }
    return issues;
  };

  const generateQuote = async () => {
    setQuoteStatus("idle");
    setQuoteMessage("");
    const issues = validateQuote();
    if (issues.length > 0) {
      setQuoteStatus("error");
      setQuoteMessage(issues.join(" "));
      return;
    }
    const payload = {
      name: form.name,
      surname: form.surname,
      email: form.email,
      phone: form.phone,
      address,
      propertyType: form.propertyType,
      ...(form.propertyType === "commercial" && form.companyName ? { companyName: form.companyName } : {}),
      ...(coordinates ? { coordinates } : {}),
      areas: areas.map(({ type, sqm, details }) => ({ type, sqm, details })),
      notes: form.notes,
      ...(form.propertyType === "commercial" && form.companyRegNumber
        ? { companyRegNumber: form.companyRegNumber }
        : {}),
      ...(form.propertyType === "commercial" && form.vatNumber ? { vatNumber: form.vatNumber } : {}),
    };
    try {
      const res = await fetch("/api/quotes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data?.details || data?.error || `Unable to create quote (${res.status})`;
        throw new Error(message);
      }
      const normalizedQuoteId =
        typeof data?.quoteId === "string"
          ? data.quoteId
          : typeof data?._id === "string"
          ? data._id
          : undefined;
      if (!normalizedQuoteId) {
        throw new Error("Quote could not be created. Please try again.");
      }
      setQuoteResult({ ...data, quoteId: normalizedQuoteId });
      setQuoteStatus("success");
      setQuoteMessage("Quote generated.");
    } catch (error) {
      setQuoteResult(undefined);
      setQuoteStatus("error");
      setQuoteMessage(error instanceof Error ? error.message : "Unable to create quote.");
    }
  };

  const acceptQuote = async () => {
    if (!quoteResult?.quoteId) return;
    await fetch("/api/quotes/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteId: quoteResult.quoteId }),
    });
  };

  const declineQuote = async (reason: string) => {
    if (!quoteResult?.quoteId) return;
    await fetch("/api/quotes/decline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteId: quoteResult.quoteId, reason }),
    });
  };

  const renderExtras = () => {
    switch (activeType) {
      case "roof":
        return (
          <div className="flex gap-3 items-center">
            <label className="text-sm text-slate-700">Storeys</label>
            <select
              className="rounded border border-slate-200 px-3 py-2 text-sm"
              value={roofStoreys}
              onChange={(e) => setRoofStoreys(e.target.value)}
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="triple">Triple</option>
            </select>
          </div>
        );
      case "gutters":
        return (
          <div className="flex gap-3 items-center">
            <label className="text-sm text-slate-700">Storeys</label>
            <select
              className="rounded border border-slate-200 px-3 py-2 text-sm"
              value={gutterStoreys}
              onChange={(e) => setGutterStoreys(e.target.value)}
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="triple">Triple</option>
            </select>
          </div>
        );
      case "driveway":
        return (
          <div className="flex flex-wrap gap-3 items-center">
            <input
              className="rounded border border-slate-200 px-3 py-2 text-sm"
              placeholder="Driveway material"
              value={drivewayMaterial}
              onChange={(e) => setDrivewayMaterial(e.target.value)}
            />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={drivewayRepoint}
                onChange={(e) => setDrivewayRepoint(e.target.checked)}
              />
              Repointing (re-sand joints)
            </label>
          </div>
        );
      case "tiles":
        return (
          <input
            className="rounded border border-slate-200 px-3 py-2 text-sm"
            placeholder="Tile material"
            value={tileMaterial}
            onChange={(e) => setTileMaterial(e.target.value)}
          />
        );
      case "wall":
        return (
          <div className="flex gap-3 items-center">
            <label className="text-sm text-slate-700">Sides</label>
            <select
              className="rounded border border-slate-200 px-3 py-2 text-sm"
              value={wallSides}
              onChange={(e) => setWallSides(e.target.value as "one" | "both")}
            >
              <option value="one">One side</option>
              <option value="both">Both sides</option>
            </select>
          </div>
        );
      case "miscellaneous":
        return (
          <input
            className="rounded border border-slate-200 px-3 py-2 text-sm"
            placeholder="Surface name (e.g. awning, retainer walls)"
            value={miscLabel}
            onChange={(e) => setMiscLabel(e.target.value)}
          />
        );
      case "windows":
        return (
          <input
            className="rounded border border-slate-200 px-3 py-2 text-sm"
            placeholder="Number of windows"
            value={windowCount}
            onChange={(e) => setWindowCount(e.target.value)}
          />
        );
      case "solar_panels":
        return (
          <input
            className="rounded border border-slate-200 px-3 py-2 text-sm"
            placeholder="Number of solar panels"
            value={solarCount}
            onChange={(e) => setSolarCount(e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="ui-shell">      <section className="ui-page pb-14">
        <section className="banner contact-banner">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="about-us-banner-content">
                  <h2>Quote</h2>
                  <div className="about-us-banner-wrapper">
                    <span>Home</span>
                    <span> . </span>
                    <h5>Quote</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="appointment">
          <div className="common-title align-title">
            <span>ONLINE QUOTING</span>
            <h3>Online Quote For <br /> Cleaning Projects.</h3>
          </div>
          <div className="container">
            <div className="appointment-container quote-logic-container">
              <div className="space-y-8">

          <div className="space-y-6">
            <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#02203D]">Address lookup</label>
              <p className="text-xs text-slate-500">Autocomplete uses Google Places. Drawing tools appear below.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm text-slate-700">Surface type</label>
              <select
                className="ui-input rounded-xl border border-[#d2d5c6] bg-white"
                value={activeType}
                onChange={(e) => setActiveType(e.target.value as AreaType)}
              >
                <option value="roof">Roof</option>
                <option value="gutters">Gutters</option>
                <option value="driveway">Driveway</option>
                <option value="tiles">Tiles</option>
                <option value="wall">Walls</option>
                <option value="house_wash">House wash</option>
                <option value="miscellaneous">Miscellaneous</option>
                <option value="windows">Windows</option>
                <option value="solar_panels">Solar Panels</option>
              </select>
              {renderExtras()}
            </div>

            {hasValidKey ? (
              <MapPanel
                apiKey={apiKey}
                address={address}
                setAddress={setAddress}
                coordinates={coordinates}
                setCoordinates={setCoordinates}
                onAreaMeasured={addArea}
                isMeasuring={isMeasuring}
                setIsMeasuring={setIsMeasuring}
                activeType={activeType}
              />
            ) : (
              <div className="space-y-3 rounded-xl border border-dashed border-[#055178]/30 bg-[#f8fbfe] p-4 text-sm text-slate-700">
                <p className="font-semibold text-[#055178]">Map measuring requires a Google Maps API key.</p>
                <p>Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env and restart the dev server.</p>
                <p>You can still enter areas manually below.</p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-[0.5fr_1fr]">
              <div className="space-y-3 rounded-xl border border-[#d2d5c6] bg-[#fbf8e5]/60 p-4">
                <h4 className="text-sm font-semibold text-[#02203D]">Manual entry</h4>
                <p className="text-xs text-slate-500">
                  For windows/solar, enter the unit count. For surfaces, enter measured m2.
                </p>
                <p className="text-xs text-slate-500">
                  Driveways, roofs, tiles, and miscellaneous use m2. Other services are priced per linear meter or unit
                  count.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    className="w-32 ui-input rounded-xl border border-[#d2d5c6]"
                    placeholder={`Manual ${unitFor(activeType)}`}
                    value={manualSqm}
                    onChange={(e) => setManualSqm(e.target.value)}
                  />
                  <button
                    onClick={addManualArea}
                    className="rounded-full border-2 border-[#f0a935] bg-[#f0a935] px-4 py-2 text-sm font-semibold text-[#02203D] transition hover:bg-transparent"
                  >
                    Add manual area
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-800">Measured areas</h3>
                <div className="space-y-2">
                  {areas.map((area) => (
                    <div
                      key={area.id}
                      className="flex items-center justify-between rounded-xl border border-[#d2d5c6] bg-white px-3 py-2 text-sm"
                    >
                      <div>
                        <span className="font-semibold capitalize text-[#02203D]">{area.type.replace("_", " ")}</span>
                        {area.details && <p className="text-xs text-slate-500">{area.details}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-700">{area.sqm} {unitFor(area.type)}</span>
                        <button
                          onClick={() => removeArea(area.id)}
                          className="text-xs font-semibold text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {areas.length === 0 && <p className="text-xs text-slate-500">Draw or add areas to continue.</p>}
                </div>
              </div>
            </div>
          </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#02203D]">Your details</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="w-full ui-input rounded-xl border border-[#d2d5c6]"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="w-full ui-input rounded-xl border border-[#d2d5c6]"
                  placeholder="Surname"
                  value={form.surname}
                  onChange={(e) => setForm({ ...form, surname: e.target.value })}
                />
              </div>
              <input
                className="w-full ui-input rounded-xl border border-[#d2d5c6]"
                placeholder="Cell Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                className="w-full ui-input rounded-xl border border-[#d2d5c6]"
                placeholder="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="w-full ui-input rounded-xl border border-[#d2d5c6]"
                placeholder="Property Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Property type</label>
                <select
                  className="w-full ui-input rounded-xl border border-[#d2d5c6]"
                  value={form.propertyType}
                  onChange={(e) =>
                    setForm({ ...form, propertyType: e.target.value as "residential" | "commercial" })
                  }
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              {form.propertyType === "commercial" && (
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className="w-full ui-input rounded-xl border border-[#d2d5c6]"
                    placeholder="Business name"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  />
                  <input
                    className="w-full ui-input rounded-xl border border-[#d2d5c6]"
                    placeholder="Company Reg Number (optional)"
                    value={form.companyRegNumber}
                    onChange={(e) => setForm({ ...form, companyRegNumber: e.target.value })}
                  />
                  <input
                    className="w-full ui-input rounded-xl border border-[#d2d5c6]"
                    placeholder="VAT Number (optional)"
                    value={form.vatNumber}
                    onChange={(e) => setForm({ ...form, vatNumber: e.target.value })}
                  />
                </div>
              )}
              <textarea
                className="w-full ui-input rounded-xl border border-[#d2d5c6]"
                placeholder="Notes (double storey, access, etc.)"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
              <button
                onClick={generateQuote}
                className="w-full rounded-full border-2 border-[#f0a935] bg-[#f0a935] px-4 py-3 text-base font-semibold text-[#02203D] transition hover:bg-transparent"
              >
                Generate Quote
              </button>
              {quoteMessage ? (
                <p className={`text-sm ${quoteStatus === "success" ? "text-emerald-700" : "text-rose-600"}`}>
                  {quoteMessage}
                </p>
              ) : null}
            </div>
              {quoteResult && (
                <div className="space-y-3 rounded-lg border border-[#d2d5c6] bg-white p-5">
                <h3 className="text-lg font-semibold text-[#02203D]">Quote summary</h3>
                <ul className="space-y-2 text-sm">
                  {quoteResult.lineItems?.map((item: any, idx: number) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span className="capitalize">{item.type}</span>
                      <span>R{item.amount}</span>
                    </li>
                  ))}
                </ul>
                {quoteResult.vatIncluded && (
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span>VAT ({Math.round((quoteResult.vatRate ?? 0) * 100)}%)</span>
                    <span>R{quoteResult.vatAmount ?? 0}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>{quoteResult.vatIncluded ? "Total (incl VAT)" : "Total (ex VAT)"}</span>
                  <span>R{quoteResult.totalAmount}</span>
                </div>
                {quoteResult.quoteNumber ? (
                  <p className="text-xs text-slate-500">Quote Number: {quoteResult.quoteNumber}</p>
                ) : quoteResult.quoteId ? (
                  <p className="text-xs text-slate-500">Quote ID: {quoteResult.quoteId}</p>
                ) : (
                  <p className="text-xs text-rose-600">Quote ID missing. Please regenerate.</p>
                )}
                <div className="flex flex-wrap gap-3 text-sm">
                  {quoteResult.quoteId ? (
                    <a
                      className="rounded-full border-2 border-[#f0a935] bg-[#f0a935] px-4 py-2 font-semibold text-[#02203D] transition hover:bg-transparent"
                      href={`/api/quotes/pdf/${quoteResult.quoteId}`}
                      target="_blank"
                    >
                      Download PDF
                    </a>
                  ) : (
                    <span className="rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-600">
                      PDF unavailable
                    </span>
                  )}
                  <button
                    onClick={acceptQuote}
                    className="rounded-full border-2 border-[#055178] bg-[#055178] px-4 py-2 font-semibold text-white transition hover:bg-transparent hover:text-[#055178]"
                  >
                    Accept Quote
                  </button>
                  <button
                    onClick={() => declineQuote("Not proceeding")}
                    className="rounded-full border-2 border-[#02203D] bg-[#02203D] px-4 py-2 font-semibold text-white transition hover:bg-transparent hover:text-[#02203D]"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}
          </div>
              </div>
            </div>
          </div>
          </div>
        </section>
      </section>
    </div>
  );
}

type MapPanelProps = {
  apiKey: string;
  address: string;
  setAddress: (v: string) => void;
  coordinates: { lat: number; lng: number } | null;
  setCoordinates: (coords: { lat: number; lng: number }) => void;
  onAreaMeasured: (sqm: number) => void;
  isMeasuring: boolean;
  setIsMeasuring: (v: boolean) => void;
  activeType: AreaType;
};

function MapPanel({
  apiKey,
  address,
  setAddress,
  coordinates,
  setCoordinates,
  onAreaMeasured,
  isMeasuring,
  setIsMeasuring,
  activeType,
}: MapPanelProps) {
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [mapType, setMapType] = useState<"roadmap" | "satellite" | "hybrid" | "terrain">("satellite");
  const [showHelper, setShowHelper] = useState(false);
  const [measurementClicks, setMeasurementClicks] = useState(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [linearPath, setLinearPath] = useState<{ lat: number; lng: number }[]>([]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
    id: "aquatech-quote-map",
  });

  const isLinearMeasurement = ["wall", "gutters", "house_wash"].includes(activeType);

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: false,
      mapTypeId: mapType,
      mapTypeControl: true,
      mapTypeControlOptions: {
        mapTypeIds: ["satellite", "hybrid"],
        style: (typeof window !== "undefined" ? (window as any).google : undefined)?.maps?.MapTypeControlStyle
          ?.DROPDOWN_MENU,
      },
      zoomControl: true,
      draggableCursor: isMeasuring ? "crosshair" : undefined,
      draggingCursor: isMeasuring ? "crosshair" : undefined,
    }),
    [mapType, isMeasuring]
  );

  const handlePolygonComplete = (polygon: any) => {
    const googleMaps = typeof window !== "undefined" ? (window as any).google : undefined;
    if (!googleMaps) return;
    if (!isMeasuring) return;
    if (isLinearMeasurement) {
      polygon.setMap(null);
      return;
    }
    const path = polygon.getPath();
    const area = googleMaps.maps.geometry.spherical.computeArea(path);
    const perimeter = googleMaps.maps.geometry.spherical.computeLength(path);
    const sqm = Number(area.toFixed(1));
    const perimeterMeters = Number(perimeter.toFixed(1));
    onAreaMeasured(isLinearMeasurement ? perimeterMeters : sqm);
    setIsMeasuring(false);
    setShowHelper(false);
    setMeasurementClicks(0);
    polygon.setMap(null);
  };

  const finishLinearMeasurement = () => {
    const googleMaps = typeof window !== "undefined" ? (window as any).google : undefined;
    if (googleMaps && linearPath.length >= 2) {
      const path = linearPath.map((point) => new googleMaps.maps.LatLng(point.lat, point.lng));
      const distance = googleMaps.maps.geometry.spherical.computeLength(path);
      onAreaMeasured(Number(distance.toFixed(1)));
    }
    setLinearPath([]);
    setIsMeasuring(false);
    setShowHelper(false);
    setMeasurementClicks(0);
  };

  const handlePlaceChanged = () => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (!place.formatted_address || !place.geometry?.location) return;
    setAddress(place.formatted_address);
    setCoordinates({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  };

  if (loadError) {
    return (
      <div className="space-y-3 rounded-xl border border-dashed border-[#055178]/30 bg-[#f8fbfe] p-4 text-sm text-red-700">
        <p className="font-semibold">Google Maps error: {loadError.message}</p>
        <p>Check that your API key is valid and has Maps JavaScript enabled.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="h-[420px] rounded-xl bg-slate-100 animate-pulse" />;
  }

  return (
    <>
      <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceChanged}>
        <input
          className="w-full ui-input rounded-xl border border-[#d2d5c6]"
          placeholder="Search address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Autocomplete>
      <div
        className="relative mt-2 h-[420px] overflow-hidden rounded-xl border-2 border-[#d2d5c6] shadow-[0_10px_24px_rgba(2,32,61,0.12)]"
        ref={mapContainerRef}
        onMouseMove={(e) => {
          if (!isMeasuring || measurementClicks < 3 || !mapContainerRef.current) return;
          const rect = mapContainerRef.current.getBoundingClientRect();
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          setShowHelper(true);
        }}
        onMouseLeave={() => setShowHelper(false)}
      >
        <div className="pointer-events-none absolute left-3 bottom-3 z-10 flex flex-col gap-2">
          <button
            onClick={() => {
              setIsMeasuring(true);
              setMeasurementClicks(0);
              setShowHelper(false);
              setLinearPath([]);
            }}
            className="pointer-events-auto rounded-full border-2 border-[#f0a935] bg-[#f0a935] px-4 py-2 text-xs font-semibold text-[#02203D] shadow transition hover:bg-transparent"
          >
            Start Measurement
          </button>
          {isLinearMeasurement && isMeasuring && (
            <button
              onClick={finishLinearMeasurement}
              className="pointer-events-auto rounded-full border-2 border-[#055178] bg-white px-4 py-2 text-xs font-semibold text-[#055178] shadow transition hover:bg-[#055178] hover:text-white"
            >
              Stop Measurement
            </button>
          )}
          <button
            onClick={() => {
              setIsMeasuring(false);
              setMeasurementClicks(0);
              setShowHelper(false);
              setLinearPath([]);
            }}
            className="pointer-events-auto rounded-full border-2 border-[#055178] bg-white px-4 py-2 text-xs font-semibold text-[#055178] shadow transition hover:bg-[#055178] hover:text-white"
          >
            Reset Measurement
          </button>
        </div>
        {isMeasuring && showHelper && measurementClicks >= 3 && (
          <div
            className="pointer-events-none absolute z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#055178] shadow"
            style={{ left: mousePos.x + 12, top: mousePos.y + 12 }}
          >
            Click to close measurement
          </div>
        )}
        <div
          className="h-full w-full"
          onMouseEnter={() => isMeasuring && measurementClicks >= 3 && setShowHelper(true)}
          onMouseLeave={() => setShowHelper(false)}
        >
          <GoogleMap
            center={coordinates || defaultCenter}
            zoom={coordinates ? 18 : 12}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={mapOptions}
            onClick={(event) => {
              if (!isMeasuring) return;
              if (isLinearMeasurement) {
                if (!event.latLng) return;
                setLinearPath((prev) => [
                  ...prev,
                  { lat: event.latLng.lat(), lng: event.latLng.lng() },
                ]);
                return;
              }
              setMeasurementClicks((prev) => prev + 1);
            }}
          >
            {isLinearMeasurement && linearPath.length > 0 && (
              <Polyline
                path={linearPath}
                options={{ strokeColor: "#f0a935", strokeOpacity: 0.9, strokeWeight: 3 }}
              />
            )}
            <DrawingManager
              onPolygonComplete={handlePolygonComplete}
              drawingMode={
                isMeasuring &&
                !isLinearMeasurement &&
                typeof window !== "undefined" &&
                (window as any).google
                  ? (window as any).google.maps.drawing.OverlayType.POLYGON
                  : null
              }
              options={{
                drawingControl: false,
                polygonOptions: { fillColor: "#f0a935", strokeColor: "#f0a935", fillOpacity: 0.45 },
              }}
            />
          </GoogleMap>
        </div>
      </div>
    </>
  );
}



