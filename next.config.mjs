/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("pdfjs-dist");
    }
    return config;
  },
};

export default nextConfig;
