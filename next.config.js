const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  // Fix: Set workspace root to this project directory to avoid lockfile detection issues
  // This silences the warning about multiple lockfiles when a parent directory has one
  outputFileTracingRoot: path.join(__dirname, './'),
};

module.exports = nextConfig;
