/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return { beforeFiles: [] };
  },
  async redirects() {
    return [{ source: "/pay.html", destination: "/pay", permanent: false }];
  }
};

module.exports = nextConfig;
