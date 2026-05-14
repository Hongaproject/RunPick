import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://dapi.kakao.com https://*.kakao.com https://*.daumcdn.net http://*.daumcdn.net",
              "style-src 'self' 'unsafe-inline' https://dapi.kakao.com https://*.daumcdn.net",
              "img-src 'self' data: blob: https://*.kakao.com https://*.kakaocdn.net https://*.daumcdn.net http://*.daumcdn.net",
              "connect-src 'self' https://*.kakao.com http://*.kakao.com https://dapi.kakao.com http://dapi.kakao.com https://*.kakaocdn.net https://*.daumcdn.net http://*.daumcdn.net https://*.supabase.co",
              "font-src 'self' data: https://*.kakaocdn.net https://*.daumcdn.net",
              "frame-src 'self' https://*.kakao.com",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
