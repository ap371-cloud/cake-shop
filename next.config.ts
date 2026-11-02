import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite ships WASM and must stay a real node module, not be bundled.
  serverExternalPackages: ["@electric-sql/pglite"],
  // The schema is read from disk at runtime, so the SQL has to be traced into
  // the server bundle or the deployed app cannot bootstrap its database.
  outputFileTracingIncludes: {
    "/*": ["./supabase/**/*.sql"],
  },
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
