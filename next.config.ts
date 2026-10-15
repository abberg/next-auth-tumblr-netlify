import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    // `pnpm build:deploy` puts the static Storybook in public/storybook.
    return [
      {
        source: '/storybook',
        destination: '/storybook/index.html',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
