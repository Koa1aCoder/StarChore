import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages deployment (see .github/workflows/nextjs.yml)
  output: "export",
  agentRules: false,
};

export default nextConfig;
