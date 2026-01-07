import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Short URL for customer support demo (for email outreach)
      {
        source: '/cs',
        destination: '/industries/customer-support#demo',
        permanent: false, // 307 redirect - use false for marketing URLs
      },
      {
        source: '/support-demo',
        destination: '/industries/customer-support#demo',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
