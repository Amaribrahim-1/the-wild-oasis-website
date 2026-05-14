/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // ppr: true,
  // staleTimes: {
  //   dynamic: 0,
  //   static: 300,
  // },
  cacheComponents: true,
  images: {
    qualities: [75, 80, 100],
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
