import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ingresso-a.akamaihd.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'teste-lista-de-filmes.s3.sa-east-1.amazonaws.com',
        pathname: '/**',
      },
    ]
  },
};

export default nextConfig;
