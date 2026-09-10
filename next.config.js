/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/standings', destination: '/matches?tab=standings', permanent: true },
      { source: '/results', destination: '/matches?tab=results', permanent: true },
      { source: '/mvp', destination: '/matches?tab=mvp', permanent: true },
      { source: '/lobby', destination: '/matches?tab=schedule', permanent: true },
      { source: '/rulebook', destination: '/rules', permanent: true },
      { source: '/squad-registration', destination: '/register', permanent: true },
    ];
  },
};

module.exports = nextConfig;
