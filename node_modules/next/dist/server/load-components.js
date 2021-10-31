"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.interopDefault = interopDefault;
exports.loadDefaultErrorComponents = loadDefaultErrorComponents;
exports.loadComponents = loadComponents;
var _constants = require("../shared/lib/constants");
var _path = require("path");
var _require = require("./require");
function interopDefault(mod) {
    return mod.default || mod;
}
async function loadDefaultErrorComponents(distDir) {
    const Document1 = interopDefault(require('next/dist/pages/_document'));
    const App = interopDefault(require('next/dist/pages/_app'));
    const ComponentMod = require('next/dist/pages/_error');
    const Component = interopDefault(ComponentMod);
    return {
        App,
        Document: Document1,
        Component,
        buildManifest: require((0, _path).join(distDir, `fallback-${_constants.BUILD_MANIFEST}`)),
        reactLoadableManifest: {
        },
        ComponentMod
    };
}
async function loadComponents(distDir, pathname, serverless) {
    if (serverless) {
        const Component = await (0, _require).requirePage(pathname, distDir, serverless);
        let { getStaticProps , getStaticPaths , getServerSideProps  } = Component;
        getStaticProps = await getStaticProps;
        getStaticPaths = await getStaticPaths;
        getServerSideProps = await getServerSideProps;
        const pageConfig = await Component.config || {
        };
        return {
            Component,
            pageConfig,
            getStaticProps,
            getStaticPaths,
            getServerSideProps,
            ComponentMod: Component
        };
    }
    const DocumentMod = await (0, _require).requirePage('/_document', distDir, serverless);
    const AppMod = await (0, _require).requirePage('/_app', distDir, serverless);
    const ComponentMod = await (0, _require).requirePage(pathname, distDir, serverless);
    const [buildManifest, reactLoadableManifest, Component, Document1, App] = await Promise.all([
        require((0, _path).join(distDir, _constants.BUILD_MANIFEST)),
        require((0, _path).join(distDir, _constants.REACT_LOADABLE_MANIFEST)),
        interopDefault(ComponentMod),
        interopDefault(DocumentMod),
        interopDefault(AppMod), 
    ]);
    const { getServerSideProps , getStaticProps , getStaticPaths  } = ComponentMod;
    return {
        App,
        Document: Document1,
        Component,
        buildManifest,
        reactLoadableManifest,
        pageConfig: ComponentMod.config || {
        },
        ComponentMod,
        getServerSideProps,
        getStaticProps,
        getStaticPaths
    };
}

//# sourceMappingURL=load-components.js.map