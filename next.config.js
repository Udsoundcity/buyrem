/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "glrupwroyxgrjclonmly.supabase.co",
      },
      // Add your own image host here, e.g.:
      // { protocol: "https", hostname: "res.cloudinary.com" },
      // { protocol: "https", hostname: "drive.google.com" },
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