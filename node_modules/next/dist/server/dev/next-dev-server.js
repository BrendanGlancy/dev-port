"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
var _fs = _interopRequireDefault(require("fs"));
var _chalk = _interopRequireDefault(require("chalk"));
var _jestWorker = require("jest-worker");
var _amphtmlValidator = _interopRequireDefault(require("next/dist/compiled/amphtml-validator"));
var _findUp = _interopRequireDefault(require("next/dist/compiled/find-up"));
var _path = require("path");
var _watchpack = _interopRequireDefault(require("watchpack"));
var _output = require("../../build/output");
var _constants = require("../../lib/constants");
var _fileExists = require("../../lib/file-exists");
var _findPagesDir = require("../../lib/find-pages-dir");
var _loadCustomRoutes = _interopRequireDefault(require("../../lib/load-custom-routes"));
var _verifyTypeScriptSetup = require("../../lib/verifyTypeScriptSetup");
var _constants1 = require("../../shared/lib/constants");
var _utils = require("../../shared/lib/router/utils");
var _nextServer = _interopRequireWildcard(require("../next-server"));
var _normalizePagePath = require("../normalize-page-path");
var _router = _interopRequireWildcard(require("../router"));
var _events = require("../../telemetry/events");
var _storage = require("../../telemetry/storage");
var _trace = require("../../telemetry/trace");
var _hotReloader = _interopRequireDefault(require("./hot-reloader"));
var _findPageFile = require("../lib/find-page-file");
var _utils1 = require("../lib/utils");
var _coalescedFunction = require("../../lib/coalesced-function");
var _loadComponents = require("../load-components");
var _utils2 = require("../../shared/lib/utils");
var _parseStack = require("@next/react-dev-overlay/lib/internal/helpers/parseStack");
var _middleware = require("@next/react-dev-overlay/lib/middleware");
var Log = _interopRequireWildcard(require("../../build/output/log"));
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
// Load ReactDevOverlay only when needed
let ReactDevOverlayImpl;
const ReactDevOverlay = (props)=>{
    if (ReactDevOverlayImpl === undefined) {
        ReactDevOverlayImpl = require('@next/react-dev-overlay/lib/client').ReactDevOverlay;
    }
    return ReactDevOverlayImpl(props);
};
class DevServer extends _nextServer.default {
    constructor(options){
        var ref, ref1;
        super({
            ...options,
            dev: true
        });
        this.renderOpts.dev = true;
        this.renderOpts.ErrorDebug = ReactDevOverlay;
        this.devReady = new Promise((resolve)=>{
            this.setDevReady = resolve;
        });
        var ref2;
        this.renderOpts.ampSkipValidation = (ref2 = (ref = this.nextConfig.experimental) === null || ref === void 0 ? void 0 : (ref1 = ref.amp) === null || ref1 === void 0 ? void 0 : ref1.skipValidation) !== null && ref2 !== void 0 ? ref2 : false;
        this.renderOpts.ampValidator = (html, pathname)=>{
            const validatorPath = this.nextConfig.experimental && this.nextConfig.experimental.amp && this.nextConfig.experimental.amp.validator;
            return _amphtmlValidator.default.getInstance(validatorPath).then((validator)=>{
                const result = validator.validateString(html);
                (0, _output).ampValidation(pathname, result.errors.filter((e)=>e.severity === 'ERROR'
                ).filter((e)=>this._filterAmpDevelopmentScript(html, e)
                ), result.errors.filter((e)=>e.severity !== 'ERROR'
                ));
            });
        };
        if (_fs.default.existsSync((0, _path).join(this.dir, 'static'))) {
            console.warn(`The static directory has been deprecated in favor of the public directory. https://nextjs.org/docs/messages/static-dir-deprecated`);
        }
        this.isCustomServer = !options.isNextDevCommand;
        this.pagesDir = (0, _findPagesDir).findPagesDir(this.dir);
        this.staticPathsWorker = new _jestWorker.Worker(require.resolve('./static-paths-worker'), {
            maxRetries: 1,
            numWorkers: this.nextConfig.experimental.cpus,
            enableWorkerThreads: this.nextConfig.experimental.workerThreads,
            forkOptions: {
                env: {
                    ...process.env,
                    // discard --inspect/--inspect-brk flags from process.env.NODE_OPTIONS. Otherwise multiple Node.js debuggers
                    // would be started if user launch Next.js in debugging mode. The number of debuggers is linked to
                    // the number of workers Next.js tries to launch. The only worker users are interested in debugging
                    // is the main Next.js one
                    NODE_OPTIONS: (0, _utils1).getNodeOptionsWithoutInspect()
                }
            }
        });
        this.staticPathsWorker.getStdout().pipe(process.stdout);
        this.staticPathsWorker.getStderr().pipe(process.stderr);
    }
    readBuildId() {
        return 'development';
    }
    async addExportPathMapRoutes() {
        // Makes `next export` exportPathMap work in development mode.
        // So that the user doesn't have to define a custom server reading the exportPathMap
        if (this.nextConfig.exportPathMap) {
            console.log('Defining routes from exportPathMap');
            const exportPathMap = await this.nextConfig.exportPathMap({
            }, {
                dev: true,
                dir: this.dir,
                outDir: null,
                distDir: this.distDir,
                buildId: this.buildId
            }) // In development we can't give a default path mapping
            ;
            for(const path in exportPathMap){
                const { page , query ={
                }  } = exportPathMap[path];
                // We use unshift so that we're sure the routes is defined before Next's default routes
                this.router.addFsRoute({
                    match: (0, _router).route(path),
                    type: 'route',
                    name: `${path} exportpathmap route`,
                    fn: async (req, res, _params, parsedUrl)=>{
                        const { query: urlQuery  } = parsedUrl;
                        Object.keys(urlQuery).filter((key)=>query[key] === undefined
                        ).forEach((key)=>console.warn(`Url '${path}' defines a query parameter '${key}' that is missing in exportPathMap`)
                        );
                        const mergedQuery = {
                            ...urlQuery,
                            ...query
                        };
                        await this.render(req, res, page, mergedQuery, parsedUrl);
                        return {
                            finished: true
                        };
                    }
                });
            }
        }
    }
    async startWatcher() {
        if (this.webpackWatcher) {
            return;
        }
        const regexPageExtension = new RegExp(`\\.+(?:${this.nextConfig.pageExtensions.join('|')})$`);
        let resolved = false;
        return new Promise((resolve, reject)=>{
            const pagesDir = this.pagesDir;
            // Watchpack doesn't emit an event for an empty directory
            _fs.default.readdir(pagesDir, (_, files)=>{
                if (files === null || files === void 0 ? void 0 : files.length) {
                    return;
                }
                if (!resolved) {
                    resolve();
                    resolved = true;
                }
            });
            let wp = this.webpackWatcher = new _watchpack.default();
            wp.watch([], [
                pagesDir
            ], 0);
            wp.on('aggregated', ()=>{
                const routedPages = [];
                const knownFiles = wp.getTimeInfoEntries();
                for (const [fileName, { accuracy  }] of knownFiles){
                    if (accuracy === undefined || !regexPageExtension.test(fileName)) {
                        continue;
                    }
                    let pageName = '/' + (0, _path).relative(pagesDir, fileName).replace(/\\+/g, '/');
                    pageName = pageName.replace(regexPageExtension, '');
                    pageName = pageName.replace(/\/index$/, '') || '/';
                    routedPages.push(pageName);
                }
                try {
                    var ref3;
                    // we serve a separate manifest with all pages for the client in
                    // dev mode so that we can match a page after a rewrite on the client
                    // before it has been built and is populated in the _buildManifest
                    const sortedRoutes = (0, _utils).getSortedRoutes(routedPages);
                    if (!((ref3 = this.sortedRoutes) === null || ref3 === void 0 ? void 0 : ref3.every((val, idx)=>val === sortedRoutes[idx]
                    ))) {
                        // emit the change so clients fetch the update
                        this.hotReloader.send(undefined, {
                            devPagesManifest: true
                        });
                    }
                    this.sortedRoutes = sortedRoutes;
                    this.dynamicRoutes = this.sortedRoutes.filter(_utils.isDynamicRoute).map((page)=>({
                            page,
                            match: (0, _utils).getRouteMatcher((0, _utils).getRouteRegex(page))
                        })
                    );
                    this.router.setDynamicRoutes(this.dynamicRoutes);
                    if (!resolved) {
                        resolve();
                        resolved = true;
                    }
                } catch (e) {
                    if (!resolved) {
                        reject(e);
                        resolved = true;
                    } else {
                        console.warn('Failed to reload dynamic routes:', e);
                    }
                }
            });
        });
    }
    async stopWatcher() {
        if (!this.webpackWatcher) {
            return;
        }
        this.webpackWatcher.close();
        this.webpackWatcher = null;
    }
    async prepare() {
        await (0, _verifyTypeScriptSetup).verifyTypeScriptSetup(this.dir, this.pagesDir, false, !this.nextConfig.images.disableStaticImages);
        this.customRoutes = await (0, _loadCustomRoutes).default(this.nextConfig);
        // reload router
        const { redirects , rewrites , headers  } = this.customRoutes;
        if (rewrites.beforeFiles.length || rewrites.afterFiles.length || rewrites.fallback.length || redirects.length || headers.length) {
            this.router = new _router.default(this.generateRoutes());
        }
        this.hotReloader = new _hotReloader.default(this.dir, {
            pagesDir: this.pagesDir,
            config: this.nextConfig,
            previewProps: this.getPreviewProps(),
            buildId: this.buildId,
            rewrites
        });
        await super.prepare();
        await this.addExportPathMapRoutes();
        await this.hotReloader.start();
        await this.startWatcher();
        this.setDevReady();
        const telemetry = new _storage.Telemetry({
            distDir: this.distDir
        });
        telemetry.record((0, _events).eventCliSession(_constants1.PHASE_DEVELOPMENT_SERVER, this.distDir, {
            webpackVersion: this.hotReloader.isWebpack5 ? 5 : 4,
            cliCommand: 'dev',
            isSrcDir: (0, _path).relative(this.dir, this.pagesDir).startsWith('src'),
            hasNowJson: !!await (0, _findUp).default('now.json', {
                cwd: this.dir
            }),
            isCustomServer: this.isCustomServer
        }));
        // This is required by the tracing subsystem.
        (0, _trace).setGlobal('telemetry', telemetry);
        process.on('unhandledRejection', (reason)=>{
            this.logErrorWithOriginalStack(reason, 'unhandledRejection').catch(()=>{
            });
        });
        process.on('uncaughtException', (err)=>{
            this.logErrorWithOriginalStack(err, 'uncaughtException').catch(()=>{
            });
        });
    }
    async close() {
        await this.stopWatcher();
        await this.staticPathsWorker.end();
        if (this.hotReloader) {
            await this.hotReloader.stop();
        }
    }
    async hasPage(pathname) {
        let normalizedPath;
        try {
            normalizedPath = (0, _normalizePagePath).normalizePagePath(pathname);
        } catch (err) {
            console.error(err);
            // if normalizing the page fails it means it isn't valid
            // so it doesn't exist so don't throw and return false
            // to ensure we return 404 instead of 500
            return false;
        }
        const pageFile = await (0, _findPageFile).findPageFile(this.pagesDir, normalizedPath, this.nextConfig.pageExtensions);
        return !!pageFile;
    }
    async _beforeCatchAllRender(req, res, params, parsedUrl) {
        const { pathname  } = parsedUrl;
        const pathParts = params.path || [];
        const path = `/${pathParts.join('/')}`;
        // check for a public file, throwing error if there's a
        // conflicting page
        let decodedPath;
        try {
            decodedPath = decodeURIComponent(path);
        } catch (_) {
            throw new _utils2.DecodeError('failed to decode param');
        }
        if (await this.hasPublicFile(decodedPath)) {
            if (await this.hasPage(pathname)) {
                const err = new Error(`A conflicting public file and page file was found for path ${pathname} https://nextjs.org/docs/messages/conflicting-public-file-page`);
                res.statusCode = 500;
                await this.renderError(err, req, res, pathname, {
                });
                return true;
            }
            await this.servePublic(req, res, pathParts);
            return true;
        }
        return false;
    }
    async run(req, res, parsedUrl) {
        var ref4;
        await this.devReady;
        const { basePath  } = this.nextConfig;
        let originalPathname = null;
        if (basePath && ((ref4 = parsedUrl.pathname) === null || ref4 === void 0 ? void 0 : ref4.startsWith(basePath))) {
            // strip basePath before handling dev bundles
            // If replace ends up replacing the full url it'll be `undefined`, meaning we have to default it to `/`
            originalPathname = parsedUrl.pathname;
            parsedUrl.pathname = parsedUrl.pathname.slice(basePath.length) || '/';
        }
        const { pathname  } = parsedUrl;
        if (pathname.startsWith('/_next')) {
            if (await (0, _fileExists).fileExists((0, _path).join(this.publicDir, '_next'))) {
                throw new Error(_constants.PUBLIC_DIR_MIDDLEWARE_CONFLICT);
            }
        }
        const { finished =false  } = await this.hotReloader.run(req, res, parsedUrl);
        if (finished) {
            return;
        }
        if (originalPathname) {
            // restore the path before continuing so that custom-routes can accurately determine
            // if they should match against the basePath or not
            parsedUrl.pathname = originalPathname;
        }
        try {
            return await super.run(req, res, parsedUrl);
        } catch (err) {
            res.statusCode = 500;
            try {
                this.logErrorWithOriginalStack(err).catch(()=>{
                });
                return await this.renderError(err, req, res, pathname, {
                    __NEXT_PAGE: (err === null || err === void 0 ? void 0 : err.page) || pathname
                });
            } catch (internalErr) {
                console.error(internalErr);
                res.end('Internal Server Error');
            }
        }
    }
    async logErrorWithOriginalStack(possibleError, type) {
        let usedOriginalStack = false;
        if ((possibleError === null || possibleError === void 0 ? void 0 : possibleError.name) && (possibleError === null || possibleError === void 0 ? void 0 : possibleError.stack) && (possibleError === null || possibleError === void 0 ? void 0 : possibleError.message)) {
            const err = possibleError;
            try {
                const frames = (0, _parseStack).parseStack(err.stack);
                const frame = frames[0];
                if (frame.lineNumber && (frame === null || frame === void 0 ? void 0 : frame.file)) {
                    var ref5, ref6, ref7, ref8;
                    const compilation = (ref5 = this.hotReloader) === null || ref5 === void 0 ? void 0 : (ref6 = ref5.serverStats) === null || ref6 === void 0 ? void 0 : ref6.compilation;
                    const moduleId = frame.file.replace(/^(webpack-internal:\/\/\/|file:\/\/)/, '');
                    const source = await (0, _middleware).getSourceById(!!((ref7 = frame.file) === null || ref7 === void 0 ? void 0 : ref7.startsWith(_path.sep)) || !!((ref8 = frame.file) === null || ref8 === void 0 ? void 0 : ref8.startsWith('file:')), moduleId, compilation, this.hotReloader.isWebpack5);
                    const originalFrame = await (0, _middleware).createOriginalStackFrame({
                        line: frame.lineNumber,
                        column: frame.column,
                        source,
                        frame,
                        modulePath: moduleId,
                        rootDirectory: this.dir
                    });
                    if (originalFrame) {
                        const { originalCodeFrame , originalStackFrame  } = originalFrame;
                        const { file , lineNumber , column , methodName  } = originalStackFrame;
                        console.error(_chalk.default.red('error') + ' - ' + `${file} (${lineNumber}:${column}) @ ${methodName}`);
                        console.error(`${_chalk.default.red(err.name)}: ${err.message}`);
                        console.error(originalCodeFrame);
                        usedOriginalStack = true;
                    }
                }
            } catch (_) {
            // failed to load original stack using source maps
            // this un-actionable by users so we don't show the
            // internal error and only show the provided stack
            }
        }
        if (!usedOriginalStack) {
            if (type) {
                Log.error(`${type}:`, possibleError);
            } else {
                Log.error(possibleError);
            }
        }
    }
    // override production loading of routes-manifest
    getCustomRoutes() {
        // actual routes will be loaded asynchronously during .prepare()
        return {
            redirects: [],
            rewrites: {
                beforeFiles: [],
                afterFiles: [],
                fallback: []
            },
            headers: []
        };
    }
    getPreviewProps() {
        if (this._devCachedPreviewProps) {
            return this._devCachedPreviewProps;
        }
        return this._devCachedPreviewProps = {
            previewModeId: _crypto.default.randomBytes(16).toString('hex'),
            previewModeSigningKey: _crypto.default.randomBytes(32).toString('hex'),
            previewModeEncryptionKey: _crypto.default.randomBytes(32).toString('hex')
        };
    }
    generateRoutes() {
        const { fsRoutes , ...otherRoutes } = super.generateRoutes();
        // In development we expose all compiled files for react-error-overlay's line show feature
        // We use unshift so that we're sure the routes is defined before Next's default routes
        fsRoutes.unshift({
            match: (0, _router).route('/_next/development/:path*'),
            type: 'route',
            name: '_next/development catchall',
            fn: async (req, res, params)=>{
                const p = (0, _path).join(this.distDir, ...params.path || []);
                await this.serveStatic(req, res, p);
                return {
                    finished: true
                };
            }
        });
        fsRoutes.unshift({
            match: (0, _router).route(`/_next/${_constants1.CLIENT_STATIC_FILES_PATH}/${this.buildId}/${_constants1.DEV_CLIENT_PAGES_MANIFEST}`),
            type: 'route',
            name: `_next/${_constants1.CLIENT_STATIC_FILES_PATH}/${this.buildId}/${_constants1.DEV_CLIENT_PAGES_MANIFEST}`,
            fn: async (_req, res)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({
                    pages: this.sortedRoutes
                }));
                return {
                    finished: true
                };
            }
        });
        fsRoutes.push({
            match: (0, _router).route('/:path*'),
            type: 'route',
            requireBasePath: false,
            name: 'catchall public directory route',
            fn: async (req, res, params, parsedUrl)=>{
                const { pathname  } = parsedUrl;
                if (!pathname) {
                    throw new Error('pathname is undefined');
                }
                // Used in development to check public directory paths
                if (await this._beforeCatchAllRender(req, res, params, parsedUrl)) {
                    return {
                        finished: true
                    };
                }
                return {
                    finished: false
                };
            }
        });
        return {
            fsRoutes,
            ...otherRoutes
        };
    }
    // In development public files are not added to the router but handled as a fallback instead
    generatePublicRoutes() {
        return [];
    }
    // In development dynamic routes cannot be known ahead of time
    getDynamicRoutes() {
        return [];
    }
    _filterAmpDevelopmentScript(html, event) {
        if (event.code !== 'DISALLOWED_SCRIPT_TAG') {
            return true;
        }
        const snippetChunks = html.split('\n');
        let snippet;
        if (!(snippet = html.split('\n')[event.line - 1]) || !(snippet = snippet.substring(event.col))) {
            return true;
        }
        snippet = snippet + snippetChunks.slice(event.line).join('\n');
        snippet = snippet.substring(0, snippet.indexOf('</script>'));
        return !snippet.includes('data-amp-development-mode-only');
    }
    async getStaticPaths(pathname) {
        // we lazy load the staticPaths to prevent the user
        // from waiting on them for the page to load in dev mode
        const __getStaticPaths = async ()=>{
            const { publicRuntimeConfig , serverRuntimeConfig , httpAgentOptions  } = this.nextConfig;
            const { locales , defaultLocale  } = this.nextConfig.i18n || {
            };
            const paths = await this.staticPathsWorker.loadStaticPaths(this.distDir, pathname, !this.renderOpts.dev && this._isLikeServerless, {
                publicRuntimeConfig,
                serverRuntimeConfig
            }, httpAgentOptions, locales, defaultLocale);
            return paths;
        };
        const { paths: staticPaths , fallback  } = (await (0, _coalescedFunction).withCoalescedInvoke(__getStaticPaths)(`staticPaths-${pathname}`, [])).value;
        return {
            staticPaths,
            fallbackMode: fallback === 'blocking' ? 'blocking' : fallback === true ? 'static' : false
        };
    }
    async ensureApiPage(pathname) {
        return this.hotReloader.ensurePage(pathname);
    }
    async findPageComponents(pathname, query = {
    }, params = null) {
        await this.devReady;
        const compilationErr = await this.getCompilationError(pathname);
        if (compilationErr) {
            // Wrap build errors so that they don't get logged again
            throw new _nextServer.WrappedBuildError(compilationErr);
        }
        try {
            await this.hotReloader.ensurePage(pathname);
            return super.findPageComponents(pathname, query, params);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
            return null;
        }
    }
    async getFallbackErrorComponents() {
        await this.hotReloader.buildFallbackError();
        // Build the error page to ensure the fallback is built too.
        // TODO: See if this can be moved into hotReloader or removed.
        await this.hotReloader.ensurePage('/_error');
        return await (0, _loadComponents).loadDefaultErrorComponents(this.distDir);
    }
    setImmutableAssetCacheControl(res) {
        res.setHeader('Cache-Control', 'no-store, must-revalidate');
    }
    servePublic(req, res, pathParts) {
        const p = (0, _path).join(this.publicDir, ...pathParts);
        return this.serveStatic(req, res, p);
    }
    async hasPublicFile(path) {
        try {
            const info = await _fs.default.promises.stat((0, _path).join(this.publicDir, path));
            return info.isFile();
        } catch (_) {
            return false;
        }
    }
    async getCompilationError(page) {
        const errors = await this.hotReloader.getCompilationErrors(page);
        if (errors.length === 0) return;
        // Return the very first error we found.
        return errors[0];
    }
    isServeableUrl(untrustedFileUrl) {
        // This method mimics what the version of `send` we use does:
        // 1. decodeURIComponent:
        //    https://github.com/pillarjs/send/blob/0.17.1/index.js#L989
        //    https://github.com/pillarjs/send/blob/0.17.1/index.js#L518-L522
        // 2. resolve:
        //    https://github.com/pillarjs/send/blob/de073ed3237ade9ff71c61673a34474b30e5d45b/index.js#L561
        let decodedUntrustedFilePath;
        try {
            // (1) Decode the URL so we have the proper file name
            decodedUntrustedFilePath = decodeURIComponent(untrustedFileUrl);
        } catch  {
            return false;
        }
        // (2) Resolve "up paths" to determine real request
        const untrustedFilePath = (0, _path).resolve(decodedUntrustedFilePath);
        // don't allow null bytes anywhere in the file path
        if (untrustedFilePath.indexOf('\x00') !== -1) {
            return false;
        }
        // During development mode, files can be added while the server is running.
        // Checks for .next/static, .next/server, static and public.
        // Note that in development .next/server is available for error reporting purposes.
        // see `packages/next/server/next-server.ts` for more details.
        if (untrustedFilePath.startsWith((0, _path).join(this.distDir, 'static') + _path.sep) || untrustedFilePath.startsWith((0, _path).join(this.distDir, 'server') + _path.sep) || untrustedFilePath.startsWith((0, _path).join(this.dir, 'static') + _path.sep) || untrustedFilePath.startsWith((0, _path).join(this.dir, 'public') + _path.sep)) {
            return true;
        }
        return false;
    }
}
exports.default = DevServer;

//# sourceMappingURL=next-dev-server.js.map