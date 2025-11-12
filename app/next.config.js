/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  outputFileTracingRoot: require('path').join(__dirname, '../'),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'takazudomodular.com',
        port: '',
        pathname: '/static/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
