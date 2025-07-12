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
        ]
    }
};

export default nextConfig;
