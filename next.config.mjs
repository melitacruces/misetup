/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/demo',
        destination: '/preview',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
