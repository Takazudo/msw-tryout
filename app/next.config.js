/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: require('path').join(__dirname, '../'),
  images: {
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
