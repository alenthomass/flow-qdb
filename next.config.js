/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/flow.dc.html" }
      ]
    };
  }
};

module.exports = nextConfig;
