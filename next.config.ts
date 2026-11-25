import type { NextConfig } from "next";

// `output: "standalone"` entra na Etapa 1, junto com o Dockerfile do Easypanel.
const nextConfig: NextConfig = {
  poweredByHeader: false,
};

export default nextConfig;
