import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Force the correct project root to avoid picking the parent lockfile
    root: path.join(__dirname),
  },
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
