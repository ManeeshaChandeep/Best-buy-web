import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns:[
            {
                protocol: 'https',
                hostname: 'api.bestbuyelectronics.lk',
                port: '',
                pathname: '/media/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost:8000',
                port: '',
                pathname: '/media/**',
            },
        ]
    }
};

export default nextConfig;
