/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    // /admin -> public/admin/index.html (অ্যাডমিন প্যানেল একই ডোমেইনে চালাতে চাইলে)
    return [
      { source: "/admin", destination: "/admin/index.html" },
      { source: "/admin/", destination: "/admin/index.html" },
    ];
  },
};
export default nextConfig;
