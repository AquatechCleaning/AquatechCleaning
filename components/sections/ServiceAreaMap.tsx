"use client";

import { GoogleMap, Polygon, useJsApiLoader } from "@react-google-maps/api";

const ACCENT = "#F0A935";

// Single polygon tracing the full service region boundary clockwise:
// Langebaan → Yzerfontein → west coast → Cape Point → False Bay →
// Gordon's Bay → Grabouw → Franschhoek → Paarl → back to Langebaan
const serviceAreas = [
  {
    name: "Full Service Region",
    paths: [
      { lat: -33.050, lng: 18.020 },  // Langebaan (NW)
      { lat: -33.390, lng: 18.130 },  // Yzerfontein
      { lat: -33.650, lng: 18.295 },  // West coast
      { lat: -33.870, lng: 18.335 },  // Near Noordhoek
      { lat: -34.025, lng: 18.348 },  // Hout Bay south
      { lat: -34.358, lng: 18.498 },  // Cape Point
      { lat: -34.208, lng: 18.865 },  // False Bay coast
      { lat: -34.082, lng: 18.870 },  // Gordon's Bay / Strand
      { lat: -34.155, lng: 19.018 },  // Grabouw
      { lat: -33.912, lng: 19.125 },  // Franschhoek
      { lat: -33.740, lng: 18.968 },  // Paarl
      { lat: -33.490, lng: 18.860 },  // North of Stellenbosch
      { lat: -33.288, lng: 18.680 },  // Heading northwest
      { lat: -33.120, lng: 18.380 },  // Northwest
    ],
  },
];

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#0d1f35" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0d1f35" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8aa3b8" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#07111f" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a3150" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0d1f35" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#aec8d9" }] },
  ],
};

const polygonOptions = {
  fillColor: ACCENT,
  fillOpacity: 0.25,
  strokeColor: ACCENT,
  strokeOpacity: 0.8,
  strokeWeight: 2,
};

const center = { lat: -33.700, lng: 18.680 };

const libraries: any[] = ["drawing", "geometry", "places"];

export function ServiceAreaMap() {
  const { isLoaded } = useJsApiLoader({
    id: "aquatech-maps",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  if (!isLoaded) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "rgba(255,255,255,0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.3)",
          fontSize: "13px",
        }}
      >
        Loading map…
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={9}
      options={mapOptions}
    >
      {serviceAreas.map((area) => (
        <Polygon key={area.name} paths={area.paths} options={polygonOptions} />
      ))}
    </GoogleMap>
  );
}
