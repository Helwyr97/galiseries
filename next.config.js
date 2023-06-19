/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.crtvg.es",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "i.blogs.es",
        port: "",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
