"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderToHTML = renderToHTML;
var _stream = require("stream");
var _react = _interopRequireDefault(require("react"));
var ReactDOMServer = _interopRequireWildcard(require("react-dom/server"));
var _server = _interopRequireDefault(require("styled-jsx/server"));
var _zenObservable = _interopRequireDefault(require("next/dist/compiled/zen-observable"));
var _log = require("../build/output/log");
var _constants = require("../lib/constants");
var _isSerializableProps = require("../lib/is-serializable-props");
var _amp = require("../shared/lib/amp");
var _ampContext = require("../shared/lib/amp-context");
var _constants1 = require("../shared/lib/constants");
var _head = require("../shared/lib/head");
var _headManagerContext = require("../shared/lib/head-manager-context");
var _loadable = _interopRequireDefault(require("../shared/lib/loadable"));
var _loadableContext = require("../shared/lib/loadable-context");
var _postProcess = _interopRequireDefault(require("../shared/lib/post-process"));
var _routerContext = require("../shared/lib/router-context");
var _isDynamic = require("../shared/lib/router/utils/is-dynamic");
var _utils = require("../shared/lib/utils");
var _apiUtils = require("./api-utils");
var _denormalizePagePath = require("./denormalize-page-path");
var _fontUtils = require("./font-utils");
var _normalizePagePath = require("./normalize-page-path");
var _optimizeAmp = _interopRequireDefault(require("./optimize-amp"));
var _loadCustomRoutes = require("../lib/load-custom-routes");
var _utils1 = require("./utils");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
function noRouter() {
    const message = 'No router instance found. you should only use "next/router" inside the client side of your app. https://nextjs.org/docs/messages/no-router-instance';
    throw new Error(message);
}
class ServerRouter {
    constructor(pathname, query, as, { isFallback  }, isReady, basePath, locale, locales, defaultLocale, domainLocales, isPreview, isLocaleDomain){
        this.route = pathname.replace(/\/$/, '') || '/';
        this.pathname = pathname;
        this.query = query;
        this.asPath = as;
        this.isFallback = isFallback;
        this.basePath = basePath;
        this.locale = locale;
        this.locales = locales;
        this.defaultLocale = defaultLocale;
        this.isReady = isReady;
        this.domainLocales = domainLocales;
        this.isPreview = !!isPreview;
        this.isLocaleDomain = !!isLocaleDomain;
    }
    push() {
        noRouter();
    }
    replace() {
        noRouter();
    }
    reload() {
        noRouter();
    }
    back() {
        noRouter();
    }
    prefetch() {
        noRouter();
    }
    beforePopState() {
        noRouter();
    }
}
function enhanceComponents(options, App, Component) {
    // For backwards compatibility
    if (typeof options === 'function') {
        return {
            App,
            Component: options(Component)
        };
    }
    return {
        App: options.enhanceApp ? options.enhanceApp(App) : App,
        Component: options.enhanceComponent ? options.enhanceComponent(Component) : Component
    };
}
const invalidKeysMsg = (methodName, invalidKeys)=>{
    return `Additional keys were returned from \`${methodName}\`. Properties intended for your component must be nested under the \`props\` key, e.g.:` + `\n\n\treturn { props: { title: 'My Title', content: '...' } }` + `\n\nKeys that need to be moved: ${invalidKeys.join(', ')}.` + `\nRead more: https://nextjs.org/docs/messages/invalid-getstaticprops-value`;
};
function checkRedirectValues(redirect, req, method) {
    const { destination , permanent , statusCode , basePath: basePath1  } = redirect;
    let errors = [];
    const hasStatusCode = typeof statusCode !== 'undefined';
    const hasPermanent = typeof permanent !== 'undefined';
    if (hasPermanent && hasStatusCode) {
        errors.push(`\`permanent\` and \`statusCode\` can not both be provided`);
    } else if (hasPermanent && typeof permanent !== 'boolean') {
        errors.push(`\`permanent\` must be \`true\` or \`false\``);
    } else if (hasStatusCode && !_loadCustomRoutes.allowedStatusCodes.has(statusCode)) {
        errors.push(`\`statusCode\` must undefined or one of ${[
            ..._loadCustomRoutes.allowedStatusCodes
        ].join(', ')}`);
    }
    const destinationType = typeof destination;
    if (destinationType !== 'string') {
        errors.push(`\`destination\` should be string but received ${destinationType}`);
    }
    const basePathType = typeof basePath1;
    if (basePathType !== 'undefined' && basePathType !== 'boolean') {
        errors.push(`\`basePath\` should be undefined or a false, received ${basePathType}`);
    }
    if (errors.length > 0) {
        throw new Error(`Invalid redirect object returned from ${method} for ${req.url}\n` + errors.join(' and ') + '\n' + `See more info here: https://nextjs.org/docs/messages/invalid-redirect-gssp`);
    }
}
async function renderToHTML(req, res, pathname1, query1, renderOpts) {
    // In dev we invalidate the cache by appending a timestamp to the resource URL.
    // This is a workaround to fix https://github.com/vercel/next.js/issues/5860
    // TODO: remove this workaround when https://bugs.webkit.org/show_bug.cgi?id=187726 is fixed.
    renderOpts.devOnlyCacheBusterQueryString = renderOpts.dev ? renderOpts.devOnlyCacheBusterQueryString || `?ts=${Date.now()}` : '';
    // don't modify original query object
    query1 = Object.assign({
    }, query1);
    const { err , dev =false , ampPath ='' , App , Document: Document1 , pageConfig ={
    } , Component , buildManifest , fontManifest , reactLoadableManifest , ErrorDebug , getStaticProps , getStaticPaths , getServerSideProps , isDataReq , params , previewProps , basePath: basePath1 , devOnlyCacheBusterQueryString , requireStaticHTML , concurrentFeatures ,  } = renderOpts;
    const getFontDefinition = (url)=>{
        if (fontManifest) {
            return (0, _fontUtils).getFontDefinitionFromManifest(url, fontManifest);
        }
        return '';
    };
    const callMiddleware = async (method, args, props = false)=>{
        let results = props ? {
        } : [];
        if (Document1[`${method}Middleware`]) {
            let middlewareFunc = await Document1[`${method}Middleware`];
            middlewareFunc = middlewareFunc.default || middlewareFunc;
            const curResults = await middlewareFunc(...args);
            if (props) {
                for (const result of curResults){
                    results = {
                        ...results,
                        ...result
                    };
                }
            } else {
                results = curResults;
            }
        }
        return results;
    };
    const headTags = (...args)=>callMiddleware('headTags', args)
    ;
    const isFallback1 = !!query1.__nextFallback;
    delete query1.__nextFallback;
    delete query1.__nextLocale;
    delete query1.__nextDefaultLocale;
    const isSSG = !!getStaticProps;
    const isBuildTimeSSG = isSSG && renderOpts.nextExport;
    const defaultAppGetInitialProps = App.getInitialProps === App.origGetInitialProps;
    const hasPageGetInitialProps = !!Component.getInitialProps;
    const pageIsDynamic = (0, _isDynamic).isDynamicRoute(pathname1);
    const isAutoExport = !hasPageGetInitialProps && defaultAppGetInitialProps && !isSSG && !getServerSideProps;
    for (const methodName of [
        'getStaticProps',
        'getServerSideProps',
        'getStaticPaths', 
    ]){
        if (Component[methodName]) {
            throw new Error(`page ${pathname1} ${methodName} ${_constants.GSSP_COMPONENT_MEMBER_ERROR}`);
        }
    }
    if (hasPageGetInitialProps && isSSG) {
        throw new Error(_constants.SSG_GET_INITIAL_PROPS_CONFLICT + ` ${pathname1}`);
    }
    if (hasPageGetInitialProps && getServerSideProps) {
        throw new Error(_constants.SERVER_PROPS_GET_INIT_PROPS_CONFLICT + ` ${pathname1}`);
    }
    if (getServerSideProps && isSSG) {
        throw new Error(_constants.SERVER_PROPS_SSG_CONFLICT + ` ${pathname1}`);
    }
    if (getStaticPaths && !pageIsDynamic) {
        throw new Error(`getStaticPaths is only allowed for dynamic SSG pages and was found on '${pathname1}'.` + `\nRead more: https://nextjs.org/docs/messages/non-dynamic-getstaticpaths-usage`);
    }
    if (!!getStaticPaths && !isSSG) {
        throw new Error(`getStaticPaths was added without a getStaticProps in ${pathname1}. Without getStaticProps, getStaticPaths does nothing`);
    }
    if (isSSG && pageIsDynamic && !getStaticPaths) {
        throw new Error(`getStaticPaths is required for dynamic SSG pages and is missing for '${pathname1}'.` + `\nRead more: https://nextjs.org/docs/messages/invalid-getstaticpaths-value`);
    }
    let asPath = renderOpts.resolvedAsPath || req.url;
    if (dev) {
        const { isValidElementType  } = require('react-is');
        if (!isValidElementType(Component)) {
            throw new Error(`The default export is not a React Component in page: "${pathname1}"`);
        }
        if (!isValidElementType(App)) {
            throw new Error(`The default export is not a React Component in page: "/_app"`);
        }
        if (!isValidElementType(Document1)) {
            throw new Error(`The default export is not a React Component in page: "/_document"`);
        }
        if (isAutoExport || isFallback1) {
            // remove query values except ones that will be set during export
            query1 = {
                ...query1.amp ? {
                    amp: query1.amp
                } : {
                }
            };
            asPath = `${pathname1}${// ensure trailing slash is present for non-dynamic auto-export pages
            req.url.endsWith('/') && pathname1 !== '/' && !pageIsDynamic ? '/' : ''}`;
            req.url = pathname1;
        }
        if (pathname1 === '/404' && (hasPageGetInitialProps || getServerSideProps)) {
            throw new Error(`\`pages/404\` ${_constants.STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR}`);
        }
        if (_constants1.STATIC_STATUS_PAGES.includes(pathname1) && (hasPageGetInitialProps || getServerSideProps)) {
            throw new Error(`\`pages${pathname1}\` ${_constants.STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR}`);
        }
    }
    await _loadable.default.preloadAll() // Make sure all dynamic imports are loaded
    ;
    let isPreview1;
    let previewData;
    if ((isSSG || getServerSideProps) && !isFallback1) {
        // Reads of this are cached on the `req` object, so this should resolve
        // instantly. There's no need to pass this data down from a previous
        // invoke, where we'd have to consider server & serverless.
        previewData = (0, _apiUtils).tryGetPreviewData(req, res, previewProps);
        isPreview1 = previewData !== false;
    }
    // url will always be set
    const routerIsReady = !!(getServerSideProps || hasPageGetInitialProps || !defaultAppGetInitialProps && !isSSG);
    const router = new ServerRouter(pathname1, query1, asPath, {
        isFallback: isFallback1
    }, routerIsReady, basePath1, renderOpts.locale, renderOpts.locales, renderOpts.defaultLocale, renderOpts.domainLocales, isPreview1, req.__nextIsLocaleDomain);
    const ctx = {
        err,
        req: isAutoExport ? undefined : req,
        res: isAutoExport ? undefined : res,
        pathname: pathname1,
        query: query1,
        asPath,
        locale: renderOpts.locale,
        locales: renderOpts.locales,
        defaultLocale: renderOpts.defaultLocale,
        AppTree: (props)=>{
            return(/*#__PURE__*/ _react.default.createElement(AppContainer, null, /*#__PURE__*/ _react.default.createElement(App, Object.assign({
            }, props, {
                Component: Component,
                router: router
            }))));
        }
    };
    let props;
    const ampState = {
        ampFirst: pageConfig.amp === true,
        hasQuery: Boolean(query1.amp),
        hybrid: pageConfig.amp === 'hybrid'
    };
    const inAmpMode = (0, _amp).isInAmpMode(ampState);
    const reactLoadableModules = [];
    let head = (0, _head).defaultHead(inAmpMode);
    let scriptLoader = {
    };
    const nextExport = !isSSG && (renderOpts.nextExport || dev && (isAutoExport || isFallback1));
    const AppContainer = ({ children  })=>/*#__PURE__*/ _react.default.createElement(_routerContext.RouterContext.Provider, {
            value: router
        }, /*#__PURE__*/ _react.default.createElement(_ampContext.AmpStateContext.Provider, {
            value: ampState
        }, /*#__PURE__*/ _react.default.createElement(_headManagerContext.HeadManagerContext.Provider, {
            value: {
                updateHead: (state)=>{
                    head = state;
                },
                updateScripts: (scripts)=>{
                    scriptLoader = scripts;
                },
                scripts: {
                },
                mountedInstances: new Set()
            }
        }, /*#__PURE__*/ _react.default.createElement(_loadableContext.LoadableContext.Provider, {
            value: (moduleName)=>reactLoadableModules.push(moduleName)
        }, children))))
    ;
    try {
        props = await (0, _utils).loadGetInitialProps(App, {
            AppTree: ctx.AppTree,
            Component,
            router,
            ctx
        });
        if ((isSSG || getServerSideProps) && isPreview1) {
            props.__N_PREVIEW = true;
        }
        if (isSSG) {
            props[_constants1.STATIC_PROPS_ID] = true;
        }
        if (isSSG && !isFallback1) {
            let data;
            try {
                data = await getStaticProps({
                    ...pageIsDynamic ? {
                        params: query1
                    } : undefined,
                    ...isPreview1 ? {
                        preview: true,
                        previewData: previewData
                    } : undefined,
                    locales: renderOpts.locales,
                    locale: renderOpts.locale,
                    defaultLocale: renderOpts.defaultLocale
                });
            } catch (staticPropsError) {
                // remove not found error code to prevent triggering legacy
                // 404 rendering
                if (staticPropsError.code === 'ENOENT') {
                    delete staticPropsError.code;
                }
                throw staticPropsError;
            }
            if (data == null) {
                throw new Error(_constants.GSP_NO_RETURNED_VALUE);
            }
            const invalidKeys = Object.keys(data).filter((key)=>key !== 'revalidate' && key !== 'props' && key !== 'redirect' && key !== 'notFound'
            );
            if (invalidKeys.includes('unstable_revalidate')) {
                throw new Error(_constants.UNSTABLE_REVALIDATE_RENAME_ERROR);
            }
            if (invalidKeys.length) {
                throw new Error(invalidKeysMsg('getStaticProps', invalidKeys));
            }
            if (process.env.NODE_ENV !== 'production') {
                if (typeof data.notFound !== 'undefined' && typeof data.redirect !== 'undefined') {
                    throw new Error(`\`redirect\` and \`notFound\` can not both be returned from ${isSSG ? 'getStaticProps' : 'getServerSideProps'} at the same time. Page: ${pathname1}\nSee more info here: https://nextjs.org/docs/messages/gssp-mixed-not-found-redirect`);
                }
            }
            if ('notFound' in data && data.notFound) {
                if (pathname1 === '/404') {
                    throw new Error(`The /404 page can not return notFound in "getStaticProps", please remove it to continue!`);
                }
                renderOpts.isNotFound = true;
            }
            if ('redirect' in data && data.redirect && typeof data.redirect === 'object') {
                checkRedirectValues(data.redirect, req, 'getStaticProps');
                if (isBuildTimeSSG) {
                    throw new Error(`\`redirect\` can not be returned from getStaticProps during prerendering (${req.url})\n` + `See more info here: https://nextjs.org/docs/messages/gsp-redirect-during-prerender`);
                }
                data.props = {
                    __N_REDIRECT: data.redirect.destination,
                    __N_REDIRECT_STATUS: (0, _loadCustomRoutes).getRedirectStatus(data.redirect)
                };
                if (typeof data.redirect.basePath !== 'undefined') {
                    data.props.__N_REDIRECT_BASE_PATH = data.redirect.basePath;
                }
                renderOpts.isRedirect = true;
            }
            if ((dev || isBuildTimeSSG) && !renderOpts.isNotFound && !(0, _isSerializableProps).isSerializableProps(pathname1, 'getStaticProps', data.props)) {
                // this fn should throw an error instead of ever returning `false`
                throw new Error('invariant: getStaticProps did not return valid props. Please report this.');
            }
            if ('revalidate' in data) {
                if (typeof data.revalidate === 'number') {
                    if (!Number.isInteger(data.revalidate)) {
                        throw new Error(`A page's revalidate option must be seconds expressed as a natural number for ${req.url}. Mixed numbers, such as '${data.revalidate}', cannot be used.` + `\nTry changing the value to '${Math.ceil(data.revalidate)}' or using \`Math.ceil()\` if you're computing the value.`);
                    } else if (data.revalidate <= 0) {
                        throw new Error(`A page's revalidate option can not be less than or equal to zero for ${req.url}. A revalidate option of zero means to revalidate after _every_ request, and implies stale data cannot be tolerated.` + `\n\nTo never revalidate, you can set revalidate to \`false\` (only ran once at build-time).` + `\nTo revalidate as soon as possible, you can set the value to \`1\`.`);
                    } else if (data.revalidate > 31536000) {
                        // if it's greater than a year for some reason error
                        console.warn(`Warning: A page's revalidate option was set to more than a year for ${req.url}. This may have been done in error.` + `\nTo only run getStaticProps at build-time and not revalidate at runtime, you can set \`revalidate\` to \`false\`!`);
                    }
                } else if (data.revalidate === true) {
                    // When enabled, revalidate after 1 second. This value is optimal for
                    // the most up-to-date page possible, but without a 1-to-1
                    // request-refresh ratio.
                    data.revalidate = 1;
                } else if (data.revalidate === false || typeof data.revalidate === 'undefined') {
                    // By default, we never revalidate.
                    data.revalidate = false;
                } else {
                    throw new Error(`A page's revalidate option must be seconds expressed as a natural number. Mixed numbers and strings cannot be used. Received '${JSON.stringify(data.revalidate)}' for ${req.url}`);
                }
            } else {
                data.revalidate = false;
            }
            props.pageProps = Object.assign({
            }, props.pageProps, 'props' in data ? data.props : undefined);
            renderOpts.revalidate = 'revalidate' in data ? data.revalidate : undefined;
            renderOpts.pageData = props;
            // this must come after revalidate is added to renderOpts
            if (renderOpts.isNotFound) {
                return null;
            }
        }
        if (getServerSideProps) {
            props[_constants1.SERVER_PROPS_ID] = true;
        }
        if (getServerSideProps && !isFallback1) {
            let data;
            try {
                data = await getServerSideProps({
                    req: req,
                    res,
                    query: query1,
                    resolvedUrl: renderOpts.resolvedUrl,
                    ...pageIsDynamic ? {
                        params: params
                    } : undefined,
                    ...previewData !== false ? {
                        preview: true,
                        previewData: previewData
                    } : undefined,
                    locales: renderOpts.locales,
                    locale: renderOpts.locale,
                    defaultLocale: renderOpts.defaultLocale
                });
            } catch (serverSidePropsError) {
                // remove not found error code to prevent triggering legacy
                // 404 rendering
                if (serverSidePropsError.code === 'ENOENT') {
                    delete serverSidePropsError.code;
                }
                throw serverSidePropsError;
            }
            if (data == null) {
                throw new Error(_constants.GSSP_NO_RETURNED_VALUE);
            }
            const invalidKeys = Object.keys(data).filter((key)=>key !== 'props' && key !== 'redirect' && key !== 'notFound'
            );
            if (data.unstable_notFound) {
                throw new Error(`unstable_notFound has been renamed to notFound, please update the field to continue. Page: ${pathname1}`);
            }
            if (data.unstable_redirect) {
                throw new Error(`unstable_redirect has been renamed to redirect, please update the field to continue. Page: ${pathname1}`);
            }
            if (invalidKeys.length) {
                throw new Error(invalidKeysMsg('getServerSideProps', invalidKeys));
            }
            if ('notFound' in data && data.notFound) {
                if (pathname1 === '/404') {
                    throw new Error(`The /404 page can not return notFound in "getStaticProps", please remove it to continue!`);
                }
                renderOpts.isNotFound = true;
                return null;
            }
            if ('redirect' in data && typeof data.redirect === 'object') {
                checkRedirectValues(data.redirect, req, 'getServerSideProps');
                data.props = {
                    __N_REDIRECT: data.redirect.destination,
                    __N_REDIRECT_STATUS: (0, _loadCustomRoutes).getRedirectStatus(data.redirect)
                };
                if (typeof data.redirect.basePath !== 'undefined') {
                    data.props.__N_REDIRECT_BASE_PATH = data.redirect.basePath;
                }
                renderOpts.isRedirect = true;
            }
            if (data.props instanceof Promise) {
                data.props = await data.props;
            }
            if ((dev || isBuildTimeSSG) && !(0, _isSerializableProps).isSerializableProps(pathname1, 'getServerSideProps', data.props)) {
                // this fn should throw an error instead of ever returning `false`
                throw new Error('invariant: getServerSideProps did not return valid props. Please report this.');
            }
            props.pageProps = Object.assign({
            }, props.pageProps, data.props);
            renderOpts.pageData = props;
        }
    } catch (dataFetchError) {
        throw dataFetchError;
    }
    if (!isSSG && !getServerSideProps && process.env.NODE_ENV !== 'production' && Object.keys((props === null || props === void 0 ? void 0 : props.pageProps) || {
    }).includes('url')) {
        console.warn(`The prop \`url\` is a reserved prop in Next.js for legacy reasons and will be overridden on page ${pathname1}\n` + `See more info here: https://nextjs.org/docs/messages/reserved-page-prop`);
    }
    // Avoid rendering page un-necessarily for getServerSideProps data request
    // and getServerSideProps/getStaticProps redirects
    if (isDataReq && !isSSG || renderOpts.isRedirect) {
        return _zenObservable.default.of(JSON.stringify(props));
    }
    // We don't call getStaticProps or getServerSideProps while generating
    // the fallback so make sure to set pageProps to an empty object
    if (isFallback1) {
        props.pageProps = {
        };
    }
    // the response might be finished on the getInitialProps call
    if ((0, _utils).isResSent(res) && !isSSG) return null;
    // we preload the buildManifest for auto-export dynamic pages
    // to speed up hydrating query values
    let filteredBuildManifest = buildManifest;
    if (isAutoExport && pageIsDynamic) {
        const page = (0, _denormalizePagePath).denormalizePagePath((0, _normalizePagePath).normalizePagePath(pathname1));
        // This code would be much cleaner using `immer` and directly pushing into
        // the result from `getPageFiles`, we could maybe consider that in the
        // future.
        if (page in filteredBuildManifest.pages) {
            filteredBuildManifest = {
                ...filteredBuildManifest,
                pages: {
                    ...filteredBuildManifest.pages,
                    [page]: [
                        ...filteredBuildManifest.pages[page],
                        ...filteredBuildManifest.lowPriorityFiles.filter((f)=>f.includes('_buildManifest')
                        ), 
                    ]
                },
                lowPriorityFiles: filteredBuildManifest.lowPriorityFiles.filter((f)=>!f.includes('_buildManifest')
                )
            };
        }
    }
    const generateStaticHTML = requireStaticHTML || inAmpMode;
    const renderToStream = (element)=>new Promise((resolve, reject)=>{
            const stream = new _stream.PassThrough();
            let resolved = false;
            const doResolve = ()=>{
                if (!resolved) {
                    resolved = true;
                    resolve(new _zenObservable.default((observer)=>{
                        stream.on('data', (chunk)=>{
                            observer.next(chunk.toString('utf-8'));
                        });
                        stream.once('end', ()=>{
                            observer.complete();
                        });
                        startWriting();
                        return ()=>{
                            abort();
                        };
                    }));
                }
            };
            const { abort , startWriting  } = ReactDOMServer.pipeToNodeWritable(element, stream, {
                onError (error) {
                    if (!resolved) {
                        resolved = true;
                        reject(error);
                    }
                    abort();
                },
                onReadyToStream () {
                    if (!generateStaticHTML) {
                        doResolve();
                    }
                },
                onCompleteAll () {
                    doResolve();
                }
            });
        }).then(multiplexResult)
    ;
    const renderDocument = async ()=>{
        if (Document1.getInitialProps) {
            const renderPage = (options = {
            })=>{
                if (ctx.err && ErrorDebug) {
                    const html = ReactDOMServer.renderToString(/*#__PURE__*/ _react.default.createElement(ErrorDebug, {
                        error: ctx.err
                    }));
                    return {
                        html,
                        head
                    };
                }
                if (dev && (props.router || props.Component)) {
                    throw new Error(`'router' and 'Component' can not be returned in getInitialProps from _app.js https://nextjs.org/docs/messages/cant-override-next-props`);
                }
                const { App: EnhancedApp , Component: EnhancedComponent  } = enhanceComponents(options, App, Component);
                const html = ReactDOMServer.renderToString(/*#__PURE__*/ _react.default.createElement(AppContainer, null, /*#__PURE__*/ _react.default.createElement(EnhancedApp, Object.assign({
                    Component: EnhancedComponent,
                    router: router
                }, props))));
                return {
                    html,
                    head
                };
            };
            const documentCtx = {
                ...ctx,
                renderPage
            };
            const docProps = await (0, _utils).loadGetInitialProps(Document1, documentCtx);
            // the response might be finished on the getInitialProps call
            if ((0, _utils).isResSent(res) && !isSSG) return null;
            if (!docProps || typeof docProps.html !== 'string') {
                const message = `"${(0, _utils).getDisplayName(Document1)}.getInitialProps()" should resolve to an object with a "html" prop set with a valid html string`;
                throw new Error(message);
            }
            return {
                bodyResult: _zenObservable.default.of(docProps.html),
                documentElement: (htmlProps)=>/*#__PURE__*/ _react.default.createElement(Document1, Object.assign({
                    }, htmlProps, docProps))
                ,
                head: docProps.head,
                headTags: await headTags(documentCtx),
                styles: docProps.styles
            };
        } else {
            const content = ctx.err && ErrorDebug ? /*#__PURE__*/ _react.default.createElement(ErrorDebug, {
                error: ctx.err
            }) : /*#__PURE__*/ _react.default.createElement(AppContainer, null, /*#__PURE__*/ _react.default.createElement(App, Object.assign({
            }, props, {
                Component: Component,
                router: router
            })));
            const bodyResult = concurrentFeatures ? await renderToStream(content) : _zenObservable.default.of(ReactDOMServer.renderToString(content));
            return {
                bodyResult,
                documentElement: ()=>Document1()
                ,
                head,
                headTags: [],
                // TODO: Experimental styled-jsx 5 support
                styles: [
                    ...(0, _server).default()
                ]
            };
        }
    };
    const documentResult = await renderDocument();
    if (!documentResult) {
        return null;
    }
    const dynamicImportsIds = new Set();
    const dynamicImports = new Set();
    for (const mod of reactLoadableModules){
        const manifestItem = reactLoadableManifest[mod];
        if (manifestItem) {
            dynamicImportsIds.add(manifestItem.id);
            manifestItem.files.forEach((item)=>{
                dynamicImports.add(item);
            });
        }
    }
    const hybridAmp = ampState.hybrid;
    const docComponentsRendered = {
    };
    const { assetPrefix , buildId , customServer , defaultLocale: defaultLocale1 , disableOptimizedLoading , domainLocales: domainLocales1 , locale: locale1 , locales: locales1 , runtimeConfig ,  } = renderOpts;
    const htmlProps = {
        __NEXT_DATA__: {
            props,
            page: pathname1,
            query: query1,
            buildId,
            assetPrefix: assetPrefix === '' ? undefined : assetPrefix,
            runtimeConfig,
            nextExport: nextExport === true ? true : undefined,
            autoExport: isAutoExport === true ? true : undefined,
            isFallback: isFallback1,
            dynamicIds: dynamicImportsIds.size === 0 ? undefined : Array.from(dynamicImportsIds),
            err: renderOpts.err ? serializeError(dev, renderOpts.err) : undefined,
            gsp: !!getStaticProps ? true : undefined,
            gssp: !!getServerSideProps ? true : undefined,
            customServer,
            gip: hasPageGetInitialProps ? true : undefined,
            appGip: !defaultAppGetInitialProps ? true : undefined,
            locale: locale1,
            locales: locales1,
            defaultLocale: defaultLocale1,
            domainLocales: domainLocales1,
            isPreview: isPreview1 === true ? true : undefined
        },
        buildManifest: filteredBuildManifest,
        docComponentsRendered,
        dangerousAsPath: router.asPath,
        canonicalBase: !renderOpts.ampPath && req.__nextStrippedLocale ? `${renderOpts.canonicalBase || ''}/${renderOpts.locale}` : renderOpts.canonicalBase,
        ampPath,
        inAmpMode,
        isDevelopment: !!dev,
        hybridAmp,
        dynamicImports: Array.from(dynamicImports),
        assetPrefix,
        // Only enabled in production as development mode has features relying on HMR (style injection for example)
        unstable_runtimeJS: process.env.NODE_ENV === 'production' ? pageConfig.unstable_runtimeJS : undefined,
        unstable_JsPreload: pageConfig.unstable_JsPreload,
        devOnlyCacheBusterQueryString,
        scriptLoader,
        locale: locale1,
        disableOptimizedLoading,
        head: documentResult.head,
        headTags: documentResult === null || documentResult === void 0 ? void 0 : documentResult.headTags,
        styles: documentResult.styles
    };
    const documentHTML = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/ _react.default.createElement(_ampContext.AmpStateContext.Provider, {
        value: ampState
    }, /*#__PURE__*/ _react.default.createElement(_utils.HtmlContext.Provider, {
        value: htmlProps
    }, documentResult.documentElement(htmlProps))));
    if (process.env.NODE_ENV !== 'production') {
        const nonRenderedComponents = [];
        const expectedDocComponents = [
            'Main',
            'Head',
            'NextScript',
            'Html'
        ];
        for (const comp of expectedDocComponents){
            if (!docComponentsRendered[comp]) {
                nonRenderedComponents.push(comp);
            }
        }
        const plural = nonRenderedComponents.length !== 1 ? 's' : '';
        if (nonRenderedComponents.length) {
            const missingComponentList = nonRenderedComponents.map((e)=>`<${e} />`
            ).join(', ');
            (0, _log).warn(`Your custom Document (pages/_document) did not render all the required subcomponent${plural}.\n` + `Missing component${plural}: ${missingComponentList}\n` + 'Read how to fix here: https://nextjs.org/docs/messages/missing-document-component');
        }
    }
    let results = [];
    const renderTargetIdx = documentHTML.indexOf(_constants1.BODY_RENDER_TARGET);
    results.push(_zenObservable.default.of('<!DOCTYPE html>' + documentHTML.substring(0, renderTargetIdx)));
    if (inAmpMode) {
        results.push(_zenObservable.default.of('<!-- __NEXT_DATA__ -->'));
    }
    results.push(documentResult.bodyResult);
    results.push(_zenObservable.default.of(documentHTML.substring(renderTargetIdx + _constants1.BODY_RENDER_TARGET.length)));
    const postProcessors = (generateStaticHTML ? [
        inAmpMode ? async (html)=>{
            html = await (0, _optimizeAmp).default(html, renderOpts.ampOptimizerConfig);
            if (!renderOpts.ampSkipValidation && renderOpts.ampValidator) {
                await renderOpts.ampValidator(html, pathname1);
            }
            return html;
        } : null,
        process.env.__NEXT_OPTIMIZE_FONTS || process.env.__NEXT_OPTIMIZE_IMAGES ? async (html)=>{
            return await (0, _postProcess).default(html, {
                getFontDefinition
            }, {
                optimizeFonts: renderOpts.optimizeFonts,
                optimizeImages: renderOpts.optimizeImages
            });
        } : null,
        renderOpts.optimizeCss ? async (html)=>{
            // eslint-disable-next-line import/no-extraneous-dependencies
            const Critters = require('critters');
            const cssOptimizer = new Critters({
                ssrMode: true,
                reduceInlineStyles: false,
                path: renderOpts.distDir,
                publicPath: `${renderOpts.assetPrefix}/_next/`,
                preload: 'media',
                fonts: false,
                ...renderOpts.optimizeCss
            });
            return await cssOptimizer.process(html);
        } : null,
        inAmpMode || hybridAmp ? async (html)=>{
            return html.replace(/&amp;amp=1/g, '&amp=1');
        } : null, 
    ] : []).filter(Boolean);
    if (postProcessors.length > 0) {
        let html = await (0, _utils1).resultsToString(results);
        for (const postProcessor of postProcessors){
            if (postProcessor) {
                html = await postProcessor(html);
            }
        }
        results = [
            _zenObservable.default.of(html)
        ];
    }
    return (0, _utils1).mergeResults(results);
}
function multiplexResult(result) {
    const chunks = [];
    const subscribers = new Set();
    let terminator = null;
    result.subscribe({
        next (chunk) {
            chunks.push(chunk);
            subscribers.forEach((subscriber)=>subscriber.next(chunk)
            );
        },
        error (error) {
            if (!terminator) {
                terminator = (subscriber)=>subscriber.error(error)
                ;
                subscribers.forEach(terminator);
                subscribers.clear();
            }
        },
        complete () {
            if (!terminator) {
                terminator = (subscriber)=>subscriber.complete()
                ;
                subscribers.forEach(terminator);
                subscribers.clear();
            }
        }
    });
    return new _zenObservable.default((observer)=>{
        for (const chunk of chunks){
            if (observer.closed) {
                return;
            }
            observer.next(chunk);
        }
        if (terminator) {
            terminator(observer);
            return;
        }
        subscribers.add(observer);
        return ()=>{
            subscribers.delete(observer);
        };
    });
}
function errorToJSON(err) {
    const { name , message , stack  } = err;
    return {
        name,
        message,
        stack
    };
}
function serializeError(dev, err) {
    if (dev) {
        return errorToJSON(err);
    }
    return {
        name: 'Internal Server Error.',
        message: '500 - Internal Server Error.',
        statusCode: 500
    };
}

//# sourceMappingURL=render.js.map