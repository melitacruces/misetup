const nextConfig = {
  async redirects() {
    return [
      {
        source: '/demo',
        destination: '/',
        permanent: true,
      },
      {
        source: '/preview',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
