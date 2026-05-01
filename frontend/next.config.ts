import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // We run `tsc --noEmit --skipLibCheck` separately (locally + in CI).
    // This prevents pre-existing peer-dependency type errors in shadcn/ui
    // components from blocking `next build`.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
