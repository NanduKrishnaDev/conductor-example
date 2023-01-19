module.exports = {
  publicRuntimeConfig: {
    conductor: {
      keyId: '41e19c3a-a68f-436b-83f6-da7625f96b35',
      keySecret: 'H4BdJjDYFO9DIMYnrtOZFTNFQgpPE7nRTUoDhW6vCIEBw6Ka',
      serverUrl: "http://localhost:3000/api",
    },
    workflows: {
      checkout: "Demo-workflow",

    }
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",

        destination: 'https://tmo-poc.orkesconductor.io/api/:path*',
      },
    ];
  },
};
