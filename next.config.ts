import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite ships WASM and must stay a real node module, not be bundled.
  serverExternalPackages: ["@electric-sql/pglite"],
  images: {
    // Catalogue photography is hosted by the design tool for now.
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
