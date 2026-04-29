import type { NextConfig } from "next";
import path from "path";

const securityHeaders = [
  // Prevent browsers guessing MIME types
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only allow site to be framed by itself (prevents clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Force HTTPS for 2 years, include subdomains
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Control referrer information sent with requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict browser features — only geolocation needed (for maps)
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()" },
  // Enable XSS filtering in older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // DNS prefetch control
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Content Security Policy
  // Allows: self, Google Maps, Google Fonts, Google Forms, inline styles (needed for JSX)
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      // Scripts: self + Google Maps + Next.js inline scripts
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com https://connect.facebook.net",
      // Styles: self + Google Fonts + inline styles (JSX inline styles require unsafe-inline)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + Google Maps tiles + data URIs
      "img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://*.google.com https://*.googleusercontent.com https://www.facebook.com",
      // Connections: self + Google Maps API + Google Forms POST + MongoDB (via server only)
      "connect-src 'self' https://*.googleapis.com https://docs.google.com https://www.facebook.com https://connect.facebook.net",
      // Frames: Google Maps embed only
      "frame-src https://docs.google.com https://www.google.com",
      "frame-ancestors 'self'",
      "form-action 'self' https://docs.google.com",
      // Media: self only
      "media-src 'self'",
      // Workers: self + blob (Google Maps uses blob workers)
      "worker-src 'self' blob:",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  serverExternalPackages: ["pdfkit"],
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
