/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/flow.dc.html" },
        { source: "/pay/:slug", destination: "/pay.html" }
      ]
    };
  }
};

module.exports = nextConfig;
