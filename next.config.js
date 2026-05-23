/ @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Allow all Supabase project URLs for uploaded product images
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/",
      },
    ],
  },
};
module.exports = nextConfig;