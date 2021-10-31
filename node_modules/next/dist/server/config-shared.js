"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.normalizeConfig = normalizeConfig;
exports.defaultConfig = void 0;
var _os = _interopRequireDefault(require("os"));
var _imageConfig = require("./image-config");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const defaultConfig = {
    env: {
    },
    webpack: null,
    webpackDevMiddleware: null,
    eslint: {
        ignoreDuringBuilds: false
    },
    typescript: {
        ignoreBuildErrors: false
    },
    distDir: '.next',
    cleanDistDir: true,
    assetPrefix: '',
    configOrigin: 'default',
    useFileSystemPublicRoutes: true,
    generateBuildId: ()=>null
    ,
    generateEtags: true,
    pageExtensions: [
        'tsx',
        'ts',
        'jsx',
        'js'
    ],
    target: 'server',
    poweredByHeader: true,
    compress: true,
    analyticsId: process.env.VERCEL_ANALYTICS_ID || '',
    images: _imageConfig.imageConfigDefault,
    devIndicators: {
        buildActivity: true
    },
    onDemandEntries: {
        maxInactiveAge: 60 * 1000,
        pagesBufferLength: 2
    },
    amp: {
        canonicalBase: ''
    },
    basePath: '',
    sassOptions: {
    },
    trailingSlash: false,
    i18n: null,
    productionBrowserSourceMaps: false,
    optimizeFonts: true,
    webpack5: Number(process.env.NEXT_PRIVATE_TEST_WEBPACK4_MODE) > 0 ? false : undefined,
    excludeDefaultMomentLocales: true,
    serverRuntimeConfig: {
    },
    publicRuntimeConfig: {
    },
    reactStrictMode: false,
    httpAgentOptions: {
        keepAlive: true
    },
    experimental: {
        swcLoader: false,
        swcMinify: false,
        cpus: Math.max(1, (Number(process.env.CIRCLE_NODE_TOTAL) || (_os.default.cpus() || {
            length: 1
        }).length) - 1),
        sharedPool: false,
        plugins: false,
        profiling: false,
        isrFlushToDisk: true,
        workerThreads: false,
        pageEnv: false,
        optimizeImages: false,
        optimizeCss: false,
        scrollRestoration: false,
        stats: false,
        externalDir: false,
        reactRoot: Number(process.env.NEXT_PRIVATE_REACT_ROOT) > 0,
        disableOptimizedLoading: false,
        gzipSize: true,
        craCompat: false,
        esmExternals: false,
        staticPageGenerationTimeout: 60,
        // default to 50MB limit
        isrMemoryCacheSize: 50 * 1024 * 1024,
        nftTracing: false,
        concurrentFeatures: false
    },
    future: {
        strictPostcssConfiguration: false
    }
};
exports.defaultConfig = defaultConfig;
function normalizeConfig(phase, config) {
    if (typeof config === 'function') {
        config = config(phase, {
            defaultConfig
        });
        if (typeof config.then === 'function') {
            throw new Error('> Promise returned in next config. https://nextjs.org/docs/messages/promise-in-next-config');
        }
    }
    return config;
}

//# sourceMappingURL=config-shared.js.map