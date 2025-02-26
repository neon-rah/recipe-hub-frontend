/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "randomuser.me",
                pathname: "/api/portraits/**",
            },
        ],
    },
    env: {
        API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
};

module.exports = nextConfig;
