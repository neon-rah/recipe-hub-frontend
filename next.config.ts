/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "randomuser.me",
                pathname: "/api/portraits/**",
            },
            {
                protocol: "http", // ou "https" en prod
                hostname: "localhost",
                port: "", // Laissez vide si Apache utilise le port 80, sinon "8080" pour Spring Boot
                pathname: "/uploads/**",
            },
        ],
    },
    env: {
        API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    },
};

module.exports = nextConfig;
