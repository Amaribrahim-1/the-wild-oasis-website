/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  ppr: true,
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ovowiofjdykttridnsaa.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
      },
    ],
  },
};

export default nextConfig;
