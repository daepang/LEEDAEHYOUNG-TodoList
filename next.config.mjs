const isElectronBuild = process.env.ELECTRON_BUILD === 'true';

const nextConfig = {
  output: isElectronBuild ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: '2mb'
    }
  }
};

export default nextConfig;
