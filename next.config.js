const { default: build } = require('next/dist/build');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
 // output: "export",
  staticPageGenerationTimeout: 120,
  images: {
    domains: ['lindo-image-bucket.s3.ap-northeast-2.amazonaws.com'],
    unoptimized: true,
  },
  transpilePackages: [
    "antd",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-input",
    "antd-img-crop",
    "@ant-design/icons",
    "@ant-design/icons-svg"
  ],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false, // ✅ ESM 모듈 관련 오류 해결
      },
    });

    // ✅ ESM 패키지를 Next.js에서 올바르게 해석할 수 있도록 변환
    config.module.rules.push({
      test: /node_modules\/(rc-util|antd|rc-pagination|rc-picker|rc-input|antd-img-crop|@ant-design\/icons|@ant-design\/icons-svg)\/.*\.js$/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["next/babel"],
        },
      },
    });

    // ✅ 파일 시스템 모듈 충돌 방지
    config.resolve.fallback = { fs: false };

    return config;
  },
};

module.exports = nextConfig;



/*const { default: build } = require('next/dist/build');

/** @type {import('next').NextConfig} */
/*const nextConfig = {
  reactStrictMode: true,
  output: "export", // ✅ 추가: Next.js가 ESM을 지원하도록 설정
  staticPageGenerationTimeout: 120,
  images: {
    domains: [],
    unoptimized: true,
  },
  transpilePackages: [
    "antd",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-input",
    "antd-img-crop",
    "@ant-design/icons",
    "@ant-design/icons-svg"
  ],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false, // ✅ ESM 모듈 관련 오류 해결
      },
    });

    // ✅ ESM 패키지를 Next.js에서 올바르게 해석할 수 있도록 변환
    config.module.rules.push({
      test: /node_modules\/(rc-util|antd|rc-pagination|rc-picker|rc-input|antd-img-crop|@ant-design\/icons|@ant-design\/icons-svg)\/.*\.js$/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["next/babel"],
        },
      },
    });

    // ✅ 파일 시스템 모듈 충돌 방지
    config.resolve.fallback = { fs: false };

    return config;
  },
};

module.exports = nextConfig;
*/