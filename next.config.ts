import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pliki z folderu wiedza/ muszą trafić na Vercel razem z /api/chat.
  outputFileTracingIncludes: {
    "/api/chat": ["./wiedza/**/*"],
  },
};

export default nextConfig;
