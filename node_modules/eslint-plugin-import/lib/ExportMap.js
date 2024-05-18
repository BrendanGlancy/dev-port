'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();exports.













































































































































































































































































































































































































































































































































































































































































































































































recursivePatternCapture = recursivePatternCapture;var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);var _path = require('path');var _doctrine = require('doctrine');var _doctrine2 = _interopRequireDefault(_doctrine);var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);var _eslint = require('eslint');var _parse = require('eslint-module-utils/parse');var _parse2 = _interopRequireDefault(_parse);var _visit = require('eslint-module-utils/visit');var _visit2 = _interopRequireDefault(_visit);var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);var _ignore = require('eslint-module-utils/ignore');var _ignore2 = _interopRequireDefault(_ignore);var _hash = require('eslint-module-utils/hash');var _unambiguous = require('eslint-module-utils/unambiguous');var unambiguous = _interopRequireWildcard(_unambiguous);var _tsconfigLoader = require('tsconfig-paths/lib/tsconfig-loader');var _arrayIncludes = require('array-includes');var _arrayIncludes2 = _interopRequireDefault(_arrayIncludes);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj['default'] = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var ts = void 0;var log = (0, _debug2['default'])('eslint-plugin-import:ExportMap');var exportCache = new Map();var tsConfigCache = new Map();var ExportMap = function () {function ExportMap(path) {_classCallCheck(this, ExportMap);this.path = path;this.namespace = new Map(); // todo: restructure to key on path, value is resolver + map of names
    this.reexports = new Map(); /**
                                 * star-exports
                                 * @type {Set} of () => ExportMap
                                 */this.dependencies = new Set(); /**
                                                                   * dependencies of this module that are not explicitly re-exported
                                                                   * @type {Map} from path = () => ExportMap
                                                                   */this.imports = new Map();this.errors = []; /**
                                                                                                                 * type {'ambiguous' | 'Module' | 'Script'}
                                                                                                                 */this.parseGoal = 'ambiguous';}_createClass(ExportMap, [{ key: 'has', /**
                                                                                                                                                                                         * Note that this does not check explicitly re-exported names for existence
                                                                                                                                                                                         * in the base namespace, but it will expand all `export * from '...'` exports
                                                                                                                                                                                         * if not found in the explicit namespace.
                                                                                                                                                                                         * @param  {string}  name
                                                                                                                                                                                         * @return {Boolean} true if `name` is exported by this module.
                                                                                                                                                                                         */value: function () {function has(name) {if (this.namespace.has(name)) return true;if (this.reexports.has(name)) return true; // default exports must be explicitly re-exported (#328)
        if (name !== 'default') {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {for (var _iterator = this.dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var dep = _step.value;var innerMap = dep(); // todo: report as unresolved?
              if (!innerMap) continue;if (innerMap.has(name)) return true;}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}}return false;}return has;}() /**
                                                                                                                                                                                                                                                                                                                                 * ensure that imported name fully resolves.
                                                                                                                                                                                                                                                                                                                                 * @param  {string} name
                                                                                                                                                                                                                                                                                                                                 * @return {{ found: boolean, path: ExportMap[] }}
                                                                                                                                                                                                                                                                                                                                 */ }, { key: 'hasDeep', value: function () {function hasDeep(name) {if (this.namespace.has(name)) return { found: true, path: [this] };if (this.reexports.has(name)) {var reexports = this.reexports.get(name);var imported = reexports.getImport(); // if import is ignored, return explicit 'null'
          if (imported == null) return { found: true, path: [this] }; // safeguard against cycles, only if name matches
          if (imported.path === this.path && reexports.local === name) {return { found: false, path: [this] };}var deep = imported.hasDeep(reexports.local);deep.path.unshift(this);return deep;} // default exports must be explicitly re-exported (#328)
        if (name !== 'default') {var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {for (var _iterator2 = this.dependencies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var dep = _step2.value;var innerMap = dep();if (innerMap == null) return { found: true, path: [this] }; // todo: report as unresolved?
              if (!innerMap) continue; // safeguard against cycles
              if (innerMap.path === this.path) continue;var innerValue = innerMap.hasDeep(name);if (innerValue.found) {innerValue.path.unshift(this);return innerValue;}}} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}}return { found: false, path: [this] };}return hasDeep;}() }, { key: 'get', value: function () {function get(name) {if (this.namespace.has(name)) return this.namespace.get(name);if (this.reexports.has(name)) {var reexports = this.reexports.get(name);var imported = reexports.getImport(); // if import is ignored, return explicit 'null'
          if (imported == null) return null; // safeguard against cycles, only if name matches
          if (imported.path === this.path && reexports.local === name) return undefined;return imported.get(reexports.local);} // default exports must be explicitly re-exported (#328)
        if (name !== 'default') {var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {for (var _iterator3 = this.dependencies[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var dep = _step3.value;var innerMap = dep(); // todo: report as unresolved?
              if (!innerMap) continue; // safeguard against cycles
              if (innerMap.path === this.path) continue;var innerValue = innerMap.get(name);if (innerValue !== undefined) return innerValue;}} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3['return']) {_iterator3['return']();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}}return undefined;}return get;}() }, { key: 'forEach', value: function () {function forEach(callback, thisArg) {var _this = this;this.namespace.forEach(function (v, n) {return callback.call(thisArg, v, n, _this);});this.reexports.forEach(function (reexports, name) {var reexported = reexports.getImport(); // can't look up meta for ignored re-exports (#348)
          callback.call(thisArg, reexported && reexported.get(reexports.local), name, _this);});this.dependencies.forEach(function (dep) {var d = dep(); // CJS / ignored dependencies won't exist (#717)
          if (d == null) return;d.forEach(function (v, n) {return n !== 'default' && callback.call(thisArg, v, n, _this);});});}return forEach;}() // todo: keys, values, entries?
  }, { key: 'reportErrors', value: function () {function reportErrors(context, declaration) {context.report({ node: declaration.source, message: 'Parse errors in imported module \'' + String(declaration.source.value) + '\': ' + ('' + String(this.errors.map(function (e) {return String(e.message) + ' (' + String(e.lineNumber) + ':' + String(e.column) + ')';}).join(', '))) });}return reportErrors;}() }, { key: 'hasDefault', get: function () {function get() {return this.get('default') != null;}return get;}() // stronger than this.has
  }, { key: 'size', get: function () {function get() {var size = this.namespace.size + this.reexports.size;this.dependencies.forEach(function (dep) {var d = dep(); // CJS / ignored dependencies won't exist (#717)
          if (d == null) return;size += d.size;});return size;}return get;}() }]);return ExportMap;}(); /**
                                                                                                         * parse docs from the first node that has leading comments
                                                                                                         */exports['default'] = ExportMap;function captureDoc(source, docStyleParsers) {var metadata = {}; // 'some' short-circuits on first 'true'
  for (var _len = arguments.length, nodes = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {nodes[_key - 2] = arguments[_key];}nodes.some(function (n) {try {var leadingComments = void 0; // n.leadingComments is legacy `attachComments` behavior
      if ('leadingComments' in n) {leadingComments = n.leadingComments;} else if (n.range) {leadingComments = source.getCommentsBefore(n);}if (!leadingComments || leadingComments.length === 0) return false;for (var name in docStyleParsers) {var doc = docStyleParsers[name](leadingComments);if (doc) {metadata.doc = doc;}}return true;} catch (err) {return false;}});return metadata;}var availableDocStyleParsers = { jsdoc: captureJsDoc, tomdoc: captureTomDoc }; /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * parse JSDoc from leading comments
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * @param {object[]} comments
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * @return {{ doc: object }}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              */function captureJsDoc(comments) {var doc = void 0; // capture XSDoc
  comments.forEach(function (comment) {// skip non-block comments
    if (comment.type !== 'Block') return;try {doc = _doctrine2['default'].parse(comment.value, { unwrap: true });} catch (err) {/* don't care, for now? maybe add to `errors?` */}});return doc;} /**
                                                                                                                                                                                                    * parse TomDoc section from comments
                                                                                                                                                                                                    */function captureTomDoc(comments) {// collect lines up to first paragraph break
  var lines = [];for (var i = 0; i < comments.length; i++) {var comment = comments[i];if (comment.value.match(/^\s*$/)) break;lines.push(comment.value.trim());} // return doctrine-like object
  var statusMatch = lines.join(' ').match(/^(Public|Internal|Deprecated):\s*(.+)/);if (statusMatch) {return { description: statusMatch[2], tags: [{ title: statusMatch[1].toLowerCase(), description: statusMatch[2] }] };}}var supportedImportTypes = new Set(['ImportDefaultSpecifier', 'ImportNamespaceSpecifier']);ExportMap.get = function (source, context) {var path = (0, _resolve2['default'])(source, context);if (path == null) return null;return ExportMap['for'](childContext(path, context));};ExportMap['for'] = function (context) {var path = context.path;var cacheKey = (0, _hash.hashObject)(context).digest('hex');var exportMap = exportCache.get(cacheKey); // return cached ignore
  if (exportMap === null) return null;var stats = _fs2['default'].statSync(path);if (exportMap != null) {// date equality check
    if (exportMap.mtime - stats.mtime === 0) {return exportMap;} // future: check content equality?
  } // check valid extensions first
  if (!(0, _ignore.hasValidExtension)(path, context)) {exportCache.set(cacheKey, null);return null;} // check for and cache ignore
  if ((0, _ignore2['default'])(path, context)) {log('ignored path due to ignore settings:', path);exportCache.set(cacheKey, null);return null;}var content = _fs2['default'].readFileSync(path, { encoding: 'utf8' }); // check for and cache unambiguous modules
  if (!unambiguous.test(content)) {log('ignored path due to unambiguous regex:', path);exportCache.set(cacheKey, null);return null;}log('cache miss', cacheKey, 'for path', path);exportMap = ExportMap.parse(path, content, context); // ambiguous modules return null
  if (exportMap == null) {log('ignored path due to ambiguous parse:', path);exportCache.set(cacheKey, null);return null;}exportMap.mtime = stats.mtime;exportCache.set(cacheKey, exportMap);return exportMap;};ExportMap.parse = function (path, content, context) {var m = new ExportMap(path);var isEsModuleInteropTrue = isEsModuleInterop();var ast = void 0;var visitorKeys = void 0;try {var result = (0, _parse2['default'])(path, content, context);ast = result.ast;visitorKeys = result.visitorKeys;} catch (err) {m.errors.push(err);return m; // can't continue
  }m.visitorKeys = visitorKeys;var hasDynamicImports = false;function processDynamicImport(source) {hasDynamicImports = true;if (source.type !== 'Literal') {return null;}var p = remotePath(source.value);if (p == null) {return null;}var importedSpecifiers = new Set();importedSpecifiers.add('ImportNamespaceSpecifier');var getter = thunkFor(p, context);m.imports.set(p, { getter: getter, declarations: new Set([{ source: { // capturing actual node reference holds full AST in memory!
          value: source.value, loc: source.loc }, importedSpecifiers: importedSpecifiers, dynamic: true }]) });}(0, _visit2['default'])(ast, visitorKeys, { ImportExpression: function () {function ImportExpression(node) {processDynamicImport(node.source);}return ImportExpression;}(), CallExpression: function () {function CallExpression(node) {if (node.callee.type === 'Import') {processDynamicImport(node.arguments[0]);}}return CallExpression;}() });var unambiguouslyESM = unambiguous.isModule(ast);if (!unambiguouslyESM && !hasDynamicImports) return null;var docstyle = context.settings && context.settings['import/docstyle'] || ['jsdoc'];var docStyleParsers = {};docstyle.forEach(function (style) {docStyleParsers[style] = availableDocStyleParsers[style];}); // attempt to collect module doc
  if (ast.comments) {ast.comments.some(function (c) {if (c.type !== 'Block') return false;try {var doc = _doctrine2['default'].parse(c.value, { unwrap: true });if (doc.tags.some(function (t) {return t.title === 'module';})) {m.doc = doc;return true;}} catch (err) {/* ignore */}return false;});}var namespaces = new Map();function remotePath(value) {return _resolve2['default'].relative(value, path, context.settings);}function resolveImport(value) {var rp = remotePath(value);if (rp == null) return null;return ExportMap['for'](childContext(rp, context));}function getNamespace(identifier) {if (!namespaces.has(identifier.name)) return;return function () {return resolveImport(namespaces.get(identifier.name));};}function addNamespace(object, identifier) {var nsfn = getNamespace(identifier);if (nsfn) {Object.defineProperty(object, 'namespace', { get: nsfn });}return object;}function processSpecifier(s, n, m) {var nsource = n.source && n.source.value;var exportMeta = {};var local = void 0;switch (s.type) {case 'ExportDefaultSpecifier':if (!nsource) return;local = 'default';break;case 'ExportNamespaceSpecifier':m.namespace.set(s.exported.name, Object.defineProperty(exportMeta, 'namespace', { get: function () {function get() {return resolveImport(nsource);}return get;}() }));return;case 'ExportAllDeclaration':m.namespace.set(s.exported.name || s.exported.value, addNamespace(exportMeta, s.source.value));return;case 'ExportSpecifier':if (!n.source) {m.namespace.set(s.exported.name || s.exported.value, addNamespace(exportMeta, s.local));return;} // else falls through
      default:local = s.local.name;break;} // todo: JSDoc
    m.reexports.set(s.exported.name, { local: local, getImport: function () {function getImport() {return resolveImport(nsource);}return getImport;}() });}function captureDependencyWithSpecifiers(n) {// import type { Foo } (TS and Flow); import typeof { Foo } (Flow)
    var declarationIsType = n.importKind === 'type' || n.importKind === 'typeof'; // import './foo' or import {} from './foo' (both 0 specifiers) is a side effect and
    // shouldn't be considered to be just importing types
    var specifiersOnlyImportingTypes = n.specifiers.length > 0;var importedSpecifiers = new Set();n.specifiers.forEach(function (specifier) {if (specifier.type === 'ImportSpecifier') {importedSpecifiers.add(specifier.imported.name || specifier.imported.value);} else if (supportedImportTypes.has(specifier.type)) {importedSpecifiers.add(specifier.type);} // import { type Foo } (Flow); import { typeof Foo } (Flow)
      specifiersOnlyImportingTypes = specifiersOnlyImportingTypes && (specifier.importKind === 'type' || specifier.importKind === 'typeof');});captureDependency(n, declarationIsType || specifiersOnlyImportingTypes, importedSpecifiers);}function captureDependency(_ref, isOnlyImportingTypes) {var source = _ref.source;var importedSpecifiers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Set();if (source == null) return null;var p = remotePath(source.value);if (p == null) return null;var declarationMetadata = { // capturing actual node reference holds full AST in memory!
      source: { value: source.value, loc: source.loc }, isOnlyImportingTypes: isOnlyImportingTypes, importedSpecifiers: importedSpecifiers };var existing = m.imports.get(p);if (existing != null) {existing.declarations.add(declarationMetadata);return existing.getter;}var getter = thunkFor(p, context);m.imports.set(p, { getter: getter, declarations: new Set([declarationMetadata]) });return getter;}var source = makeSourceCode(content, ast);function readTsConfig(context) {var tsConfigInfo = (0, _tsconfigLoader.tsConfigLoader)({ cwd: context.parserOptions && context.parserOptions.tsconfigRootDir || process.cwd(), getEnv: function () {function getEnv(key) {return process.env[key];}return getEnv;}() });try {if (tsConfigInfo.tsConfigPath !== undefined) {// Projects not using TypeScript won't have `typescript` installed.
        if (!ts) {ts = require('typescript');}var configFile = ts.readConfigFile(tsConfigInfo.tsConfigPath, ts.sys.readFile);return ts.parseJsonConfigFileContent(configFile.config, ts.sys, (0, _path.dirname)(tsConfigInfo.tsConfigPath));}} catch (e) {// Catch any errors
    }return null;}function isEsModuleInterop() {var cacheKey = (0, _hash.hashObject)({ tsconfigRootDir: context.parserOptions && context.parserOptions.tsconfigRootDir }).digest('hex');var tsConfig = tsConfigCache.get(cacheKey);if (typeof tsConfig === 'undefined') {tsConfig = readTsConfig(context);tsConfigCache.set(cacheKey, tsConfig);}return tsConfig && tsConfig.options ? tsConfig.options.esModuleInterop : false;}ast.body.forEach(function (n) {if (n.type === 'ExportDefaultDeclaration') {var exportMeta = captureDoc(source, docStyleParsers, n);if (n.declaration.type === 'Identifier') {addNamespace(exportMeta, n.declaration);}m.namespace.set('default', exportMeta);return;}if (n.type === 'ExportAllDeclaration') {var getter = captureDependency(n, n.exportKind === 'type');if (getter) m.dependencies.add(getter);if (n.exported) {processSpecifier(n, n.exported, m);}return;} // capture namespaces in case of later export
    if (n.type === 'ImportDeclaration') {captureDependencyWithSpecifiers(n);var ns = n.specifiers.find(function (s) {return s.type === 'ImportNamespaceSpecifier';});if (ns) {namespaces.set(ns.local.name, n.source.value);}return;}if (n.type === 'ExportNamedDeclaration') {captureDependencyWithSpecifiers(n); // capture declaration
      if (n.declaration != null) {switch (n.declaration.type) {case 'FunctionDeclaration':case 'ClassDeclaration':case 'TypeAlias': // flowtype with babel-eslint parser
          case 'InterfaceDeclaration':case 'DeclareFunction':case 'TSDeclareFunction':case 'TSEnumDeclaration':case 'TSTypeAliasDeclaration':case 'TSInterfaceDeclaration':case 'TSAbstractClassDeclaration':case 'TSModuleDeclaration':m.namespace.set(n.declaration.id.name, captureDoc(source, docStyleParsers, n));break;case 'VariableDeclaration':n.declaration.declarations.forEach(function (d) {return recursivePatternCapture(d.id, function (id) {return m.namespace.set(id.name, captureDoc(source, docStyleParsers, d, n));});});break;}}n.specifiers.forEach(function (s) {return processSpecifier(s, n, m);});}var exports = ['TSExportAssignment'];if (isEsModuleInteropTrue) {exports.push('TSNamespaceExportDeclaration');} // This doesn't declare anything, but changes what's being exported.
    if ((0, _arrayIncludes2['default'])(exports, n.type)) {var exportedName = n.type === 'TSNamespaceExportDeclaration' ? (n.id || n.name).name : n.expression && n.expression.name || n.expression.id && n.expression.id.name || null;var declTypes = ['VariableDeclaration', 'ClassDeclaration', 'TSDeclareFunction', 'TSEnumDeclaration', 'TSTypeAliasDeclaration', 'TSInterfaceDeclaration', 'TSAbstractClassDeclaration', 'TSModuleDeclaration'];var exportedDecls = ast.body.filter(function (_ref2) {var type = _ref2.type,id = _ref2.id,declarations = _ref2.declarations;return (0, _arrayIncludes2['default'])(declTypes, type) && (id && id.name === exportedName || declarations && declarations.find(function (d) {return d.id.name === exportedName;}));});if (exportedDecls.length === 0) {// Export is not referencing any local declaration, must be re-exporting
        m.namespace.set('default', captureDoc(source, docStyleParsers, n));return;}if (isEsModuleInteropTrue // esModuleInterop is on in tsconfig
      && !m.namespace.has('default') // and default isn't added already
      ) {m.namespace.set('default', {}); // add default export
        }exportedDecls.forEach(function (decl) {if (decl.type === 'TSModuleDeclaration') {if (decl.body && decl.body.type === 'TSModuleDeclaration') {m.namespace.set(decl.body.id.name, captureDoc(source, docStyleParsers, decl.body));} else if (decl.body && decl.body.body) {decl.body.body.forEach(function (moduleBlockNode) {// Export-assignment exports all members in the namespace,
              // explicitly exported or not.
              var namespaceDecl = moduleBlockNode.type === 'ExportNamedDeclaration' ? moduleBlockNode.declaration : moduleBlockNode;if (!namespaceDecl) {// TypeScript can check this for us; we needn't
              } else if (namespaceDecl.type === 'VariableDeclaration') {namespaceDecl.declarations.forEach(function (d) {return recursivePatternCapture(d.id, function (id) {return m.namespace.set(id.name, captureDoc(source, docStyleParsers, decl, namespaceDecl, moduleBlockNode));});});} else {m.namespace.set(namespaceDecl.id.name, captureDoc(source, docStyleParsers, moduleBlockNode));}});}} else {// Export as default
          m.namespace.set('default', captureDoc(source, docStyleParsers, decl));}});}});if (isEsModuleInteropTrue // esModuleInterop is on in tsconfig
  && m.namespace.size > 0 // anything is exported
  && !m.namespace.has('default') // and default isn't added already
  ) {m.namespace.set('default', {}); // add default export
    }if (unambiguouslyESM) {m.parseGoal = 'Module';}return m;}; /**
                                                                 * The creation of this closure is isolated from other scopes
                                                                 * to avoid over-retention of unrelated variables, which has
                                                                 * caused memory leaks. See #1266.
                                                                 */function thunkFor(p, context) {return function () {return ExportMap['for'](childContext(p, context));};} /**
                                                                                                                                                                             * Traverse a pattern/identifier node, calling 'callback'
                                                                                                                                                                             * for each leaf identifier.
                                                                                                                                                                             * @param  {node}   pattern
                                                                                                                                                                             * @param  {Function} callback
                                                                                                                                                                             * @return {void}
                                                                                                                                                                             */function recursivePatternCapture(pattern, callback) {switch (pattern.type) {case 'Identifier': // base case
      callback(pattern);break;case 'ObjectPattern':pattern.properties.forEach(function (p) {if (p.type === 'ExperimentalRestProperty' || p.type === 'RestElement') {callback(p.argument);return;}recursivePatternCapture(p.value, callback);});break;case 'ArrayPattern':pattern.elements.forEach(function (element) {if (element == null) return;if (element.type === 'ExperimentalRestProperty' || element.type === 'RestElement') {callback(element.argument);return;}recursivePatternCapture(element, callback);});break;case 'AssignmentPattern':callback(pattern.left);break;}} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * don't hold full context object in memory, just grab what we need.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */function childContext(path, context) {var settings = context.settings,parserOptions = context.parserOptions,parserPath = context.parserPath;return { settings: settings, parserOptions: parserOptions, parserPath: parserPath, path: path };} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * sometimes legacy support isn't _that_ hard... right?
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */function makeSourceCode(text, ast) {if (_eslint.SourceCode.length > 1) {// ESLint 3
    return new _eslint.SourceCode(text, ast);} else {// ESLint 4, 5
    return new _eslint.SourceCode({ text: text, ast: ast });}}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FeHBvcnRNYXAuanMiXSwibmFtZXMiOlsicmVjdXJzaXZlUGF0dGVybkNhcHR1cmUiLCJ1bmFtYmlndW91cyIsInRzIiwibG9nIiwiZXhwb3J0Q2FjaGUiLCJNYXAiLCJ0c0NvbmZpZ0NhY2hlIiwiRXhwb3J0TWFwIiwicGF0aCIsIm5hbWVzcGFjZSIsInJlZXhwb3J0cyIsImRlcGVuZGVuY2llcyIsIlNldCIsImltcG9ydHMiLCJlcnJvcnMiLCJwYXJzZUdvYWwiLCJuYW1lIiwiaGFzIiwiZGVwIiwiaW5uZXJNYXAiLCJmb3VuZCIsImdldCIsImltcG9ydGVkIiwiZ2V0SW1wb3J0IiwibG9jYWwiLCJkZWVwIiwiaGFzRGVlcCIsInVuc2hpZnQiLCJpbm5lclZhbHVlIiwidW5kZWZpbmVkIiwiY2FsbGJhY2siLCJ0aGlzQXJnIiwiZm9yRWFjaCIsInYiLCJuIiwiY2FsbCIsInJlZXhwb3J0ZWQiLCJkIiwiY29udGV4dCIsImRlY2xhcmF0aW9uIiwicmVwb3J0Iiwibm9kZSIsInNvdXJjZSIsIm1lc3NhZ2UiLCJ2YWx1ZSIsIm1hcCIsImUiLCJsaW5lTnVtYmVyIiwiY29sdW1uIiwiam9pbiIsInNpemUiLCJjYXB0dXJlRG9jIiwiZG9jU3R5bGVQYXJzZXJzIiwibWV0YWRhdGEiLCJub2RlcyIsInNvbWUiLCJsZWFkaW5nQ29tbWVudHMiLCJyYW5nZSIsImdldENvbW1lbnRzQmVmb3JlIiwibGVuZ3RoIiwiZG9jIiwiZXJyIiwiYXZhaWxhYmxlRG9jU3R5bGVQYXJzZXJzIiwianNkb2MiLCJjYXB0dXJlSnNEb2MiLCJ0b21kb2MiLCJjYXB0dXJlVG9tRG9jIiwiY29tbWVudHMiLCJjb21tZW50IiwidHlwZSIsImRvY3RyaW5lIiwicGFyc2UiLCJ1bndyYXAiLCJsaW5lcyIsImkiLCJtYXRjaCIsInB1c2giLCJ0cmltIiwic3RhdHVzTWF0Y2giLCJkZXNjcmlwdGlvbiIsInRhZ3MiLCJ0aXRsZSIsInRvTG93ZXJDYXNlIiwic3VwcG9ydGVkSW1wb3J0VHlwZXMiLCJjaGlsZENvbnRleHQiLCJjYWNoZUtleSIsImRpZ2VzdCIsImV4cG9ydE1hcCIsInN0YXRzIiwiZnMiLCJzdGF0U3luYyIsIm10aW1lIiwic2V0IiwiY29udGVudCIsInJlYWRGaWxlU3luYyIsImVuY29kaW5nIiwidGVzdCIsIm0iLCJpc0VzTW9kdWxlSW50ZXJvcFRydWUiLCJpc0VzTW9kdWxlSW50ZXJvcCIsImFzdCIsInZpc2l0b3JLZXlzIiwicmVzdWx0IiwiaGFzRHluYW1pY0ltcG9ydHMiLCJwcm9jZXNzRHluYW1pY0ltcG9ydCIsInAiLCJyZW1vdGVQYXRoIiwiaW1wb3J0ZWRTcGVjaWZpZXJzIiwiYWRkIiwiZ2V0dGVyIiwidGh1bmtGb3IiLCJkZWNsYXJhdGlvbnMiLCJsb2MiLCJkeW5hbWljIiwiSW1wb3J0RXhwcmVzc2lvbiIsIkNhbGxFeHByZXNzaW9uIiwiY2FsbGVlIiwiYXJndW1lbnRzIiwidW5hbWJpZ3VvdXNseUVTTSIsImlzTW9kdWxlIiwiZG9jc3R5bGUiLCJzZXR0aW5ncyIsInN0eWxlIiwiYyIsInQiLCJuYW1lc3BhY2VzIiwicmVzb2x2ZSIsInJlbGF0aXZlIiwicmVzb2x2ZUltcG9ydCIsInJwIiwiZ2V0TmFtZXNwYWNlIiwiaWRlbnRpZmllciIsImFkZE5hbWVzcGFjZSIsIm9iamVjdCIsIm5zZm4iLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInByb2Nlc3NTcGVjaWZpZXIiLCJzIiwibnNvdXJjZSIsImV4cG9ydE1ldGEiLCJleHBvcnRlZCIsImNhcHR1cmVEZXBlbmRlbmN5V2l0aFNwZWNpZmllcnMiLCJkZWNsYXJhdGlvbklzVHlwZSIsImltcG9ydEtpbmQiLCJzcGVjaWZpZXJzT25seUltcG9ydGluZ1R5cGVzIiwic3BlY2lmaWVycyIsInNwZWNpZmllciIsImNhcHR1cmVEZXBlbmRlbmN5IiwiaXNPbmx5SW1wb3J0aW5nVHlwZXMiLCJkZWNsYXJhdGlvbk1ldGFkYXRhIiwiZXhpc3RpbmciLCJtYWtlU291cmNlQ29kZSIsInJlYWRUc0NvbmZpZyIsInRzQ29uZmlnSW5mbyIsImN3ZCIsInBhcnNlck9wdGlvbnMiLCJ0c2NvbmZpZ1Jvb3REaXIiLCJwcm9jZXNzIiwiZ2V0RW52Iiwia2V5IiwiZW52IiwidHNDb25maWdQYXRoIiwicmVxdWlyZSIsImNvbmZpZ0ZpbGUiLCJyZWFkQ29uZmlnRmlsZSIsInN5cyIsInJlYWRGaWxlIiwicGFyc2VKc29uQ29uZmlnRmlsZUNvbnRlbnQiLCJjb25maWciLCJ0c0NvbmZpZyIsIm9wdGlvbnMiLCJlc01vZHVsZUludGVyb3AiLCJib2R5IiwiZXhwb3J0S2luZCIsIm5zIiwiZmluZCIsImlkIiwiZXhwb3J0cyIsImV4cG9ydGVkTmFtZSIsImV4cHJlc3Npb24iLCJkZWNsVHlwZXMiLCJleHBvcnRlZERlY2xzIiwiZmlsdGVyIiwiZGVjbCIsIm1vZHVsZUJsb2NrTm9kZSIsIm5hbWVzcGFjZURlY2wiLCJwYXR0ZXJuIiwicHJvcGVydGllcyIsImFyZ3VtZW50IiwiZWxlbWVudHMiLCJlbGVtZW50IiwibGVmdCIsInBhcnNlclBhdGgiLCJ0ZXh0IiwiU291cmNlQ29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUErQzBILFFBQVExSCxJQUFSLEtBQWlCLGFBQXBFLEVBQW1GLENBQ2pGdkMsU0FBU2lLLFFBQVFGLFFBQWpCLEVBQ0EsT0FDRCxDQUNEN0wsd0JBQXdCK0wsT0FBeEIsRUFBaUNqSyxRQUFqQyxFQUNELENBUEQsRUFRQSxNQUVGLEtBQUssbUJBQUwsQ0FDRUEsU0FBUzZKLFFBQVFLLElBQWpCLEVBQ0EsTUE1QkYsQ0E4QkQsQyxDQUVEOzt5akJBR0EsU0FBUzVHLFlBQVQsQ0FBc0I1RSxJQUF0QixFQUE0QjhCLE9BQTVCLEVBQXFDLEtBQzNCbUYsUUFEMkIsR0FDYW5GLE9BRGIsQ0FDM0JtRixRQUQyQixDQUNqQm1DLGFBRGlCLEdBQ2F0SCxPQURiLENBQ2pCc0gsYUFEaUIsQ0FDRnFDLFVBREUsR0FDYTNKLE9BRGIsQ0FDRjJKLFVBREUsQ0FFbkMsT0FBTyxFQUNMeEUsa0JBREssRUFFTG1DLDRCQUZLLEVBR0xxQyxzQkFISyxFQUlMekwsVUFKSyxFQUFQLENBTUQsQyxDQUdEOzsweUJBR0EsU0FBU2dKLGNBQVQsQ0FBd0IwQyxJQUF4QixFQUE4QjlGLEdBQTlCLEVBQW1DLENBQ2pDLElBQUkrRixtQkFBV3hJLE1BQVgsR0FBb0IsQ0FBeEIsRUFBMkIsQ0FDekI7QUFDQSxXQUFPLElBQUl3SSxrQkFBSixDQUFlRCxJQUFmLEVBQXFCOUYsR0FBckIsQ0FBUCxDQUNELENBSEQsTUFHTyxDQUNMO0FBQ0EsV0FBTyxJQUFJK0Ysa0JBQUosQ0FBZSxFQUFFRCxVQUFGLEVBQVE5RixRQUFSLEVBQWYsQ0FBUCxDQUNELENBQ0YiLCJmaWxlIjoiRXhwb3J0TWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCB7IGRpcm5hbWUgfSBmcm9tICdwYXRoJztcblxuaW1wb3J0IGRvY3RyaW5lIGZyb20gJ2RvY3RyaW5lJztcblxuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcblxuaW1wb3J0IHsgU291cmNlQ29kZSB9IGZyb20gJ2VzbGludCc7XG5cbmltcG9ydCBwYXJzZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3BhcnNlJztcbmltcG9ydCB2aXNpdCBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3Zpc2l0JztcbmltcG9ydCByZXNvbHZlIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvcmVzb2x2ZSc7XG5pbXBvcnQgaXNJZ25vcmVkLCB7IGhhc1ZhbGlkRXh0ZW5zaW9uIH0gZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9pZ25vcmUnO1xuXG5pbXBvcnQgeyBoYXNoT2JqZWN0IH0gZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9oYXNoJztcbmltcG9ydCAqIGFzIHVuYW1iaWd1b3VzIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvdW5hbWJpZ3VvdXMnO1xuXG5pbXBvcnQgeyB0c0NvbmZpZ0xvYWRlciB9IGZyb20gJ3RzY29uZmlnLXBhdGhzL2xpYi90c2NvbmZpZy1sb2FkZXInO1xuXG5pbXBvcnQgaW5jbHVkZXMgZnJvbSAnYXJyYXktaW5jbHVkZXMnO1xuXG5sZXQgdHM7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdlc2xpbnQtcGx1Z2luLWltcG9ydDpFeHBvcnRNYXAnKTtcblxuY29uc3QgZXhwb3J0Q2FjaGUgPSBuZXcgTWFwKCk7XG5jb25zdCB0c0NvbmZpZ0NhY2hlID0gbmV3IE1hcCgpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHBvcnRNYXAge1xuICBjb25zdHJ1Y3RvcihwYXRoKSB7XG4gICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG5ldyBNYXAoKTtcbiAgICAvLyB0b2RvOiByZXN0cnVjdHVyZSB0byBrZXkgb24gcGF0aCwgdmFsdWUgaXMgcmVzb2x2ZXIgKyBtYXAgb2YgbmFtZXNcbiAgICB0aGlzLnJlZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAvKipcbiAgICAgKiBzdGFyLWV4cG9ydHNcbiAgICAgKiBAdHlwZSB7U2V0fSBvZiAoKSA9PiBFeHBvcnRNYXBcbiAgICAgKi9cbiAgICB0aGlzLmRlcGVuZGVuY2llcyA9IG5ldyBTZXQoKTtcbiAgICAvKipcbiAgICAgKiBkZXBlbmRlbmNpZXMgb2YgdGhpcyBtb2R1bGUgdGhhdCBhcmUgbm90IGV4cGxpY2l0bHkgcmUtZXhwb3J0ZWRcbiAgICAgKiBAdHlwZSB7TWFwfSBmcm9tIHBhdGggPSAoKSA9PiBFeHBvcnRNYXBcbiAgICAgKi9cbiAgICB0aGlzLmltcG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcbiAgICAvKipcbiAgICAgKiB0eXBlIHsnYW1iaWd1b3VzJyB8ICdNb2R1bGUnIHwgJ1NjcmlwdCd9XG4gICAgICovXG4gICAgdGhpcy5wYXJzZUdvYWwgPSAnYW1iaWd1b3VzJztcbiAgfVxuXG4gIGdldCBoYXNEZWZhdWx0KCkgeyByZXR1cm4gdGhpcy5nZXQoJ2RlZmF1bHQnKSAhPSBudWxsOyB9IC8vIHN0cm9uZ2VyIHRoYW4gdGhpcy5oYXNcblxuICBnZXQgc2l6ZSgpIHtcbiAgICBsZXQgc2l6ZSA9IHRoaXMubmFtZXNwYWNlLnNpemUgKyB0aGlzLnJlZXhwb3J0cy5zaXplO1xuICAgIHRoaXMuZGVwZW5kZW5jaWVzLmZvckVhY2goZGVwID0+IHtcbiAgICAgIGNvbnN0IGQgPSBkZXAoKTtcbiAgICAgIC8vIENKUyAvIGlnbm9yZWQgZGVwZW5kZW5jaWVzIHdvbid0IGV4aXN0ICgjNzE3KVxuICAgICAgaWYgKGQgPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgc2l6ZSArPSBkLnNpemU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNpemU7XG4gIH1cblxuICAvKipcbiAgICogTm90ZSB0aGF0IHRoaXMgZG9lcyBub3QgY2hlY2sgZXhwbGljaXRseSByZS1leHBvcnRlZCBuYW1lcyBmb3IgZXhpc3RlbmNlXG4gICAqIGluIHRoZSBiYXNlIG5hbWVzcGFjZSwgYnV0IGl0IHdpbGwgZXhwYW5kIGFsbCBgZXhwb3J0ICogZnJvbSAnLi4uJ2AgZXhwb3J0c1xuICAgKiBpZiBub3QgZm91bmQgaW4gdGhlIGV4cGxpY2l0IG5hbWVzcGFjZS5cbiAgICogQHBhcmFtICB7c3RyaW5nfSAgbmFtZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGBuYW1lYCBpcyBleHBvcnRlZCBieSB0aGlzIG1vZHVsZS5cbiAgICovXG4gIGhhcyhuYW1lKSB7XG4gICAgaWYgKHRoaXMubmFtZXNwYWNlLmhhcyhuYW1lKSkgcmV0dXJuIHRydWU7XG4gICAgaWYgKHRoaXMucmVleHBvcnRzLmhhcyhuYW1lKSkgcmV0dXJuIHRydWU7XG5cbiAgICAvLyBkZWZhdWx0IGV4cG9ydHMgbXVzdCBiZSBleHBsaWNpdGx5IHJlLWV4cG9ydGVkICgjMzI4KVxuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIGZvciAoY29uc3QgZGVwIG9mIHRoaXMuZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGNvbnN0IGlubmVyTWFwID0gZGVwKCk7XG5cbiAgICAgICAgLy8gdG9kbzogcmVwb3J0IGFzIHVucmVzb2x2ZWQ/XG4gICAgICAgIGlmICghaW5uZXJNYXApIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChpbm5lck1hcC5oYXMobmFtZSkpIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBlbnN1cmUgdGhhdCBpbXBvcnRlZCBuYW1lIGZ1bGx5IHJlc29sdmVzLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWVcbiAgICogQHJldHVybiB7eyBmb3VuZDogYm9vbGVhbiwgcGF0aDogRXhwb3J0TWFwW10gfX1cbiAgICovXG4gIGhhc0RlZXAobmFtZSkge1xuICAgIGlmICh0aGlzLm5hbWVzcGFjZS5oYXMobmFtZSkpIHJldHVybiB7IGZvdW5kOiB0cnVlLCBwYXRoOiBbdGhpc10gfTtcblxuICAgIGlmICh0aGlzLnJlZXhwb3J0cy5oYXMobmFtZSkpIHtcbiAgICAgIGNvbnN0IHJlZXhwb3J0cyA9IHRoaXMucmVleHBvcnRzLmdldChuYW1lKTtcbiAgICAgIGNvbnN0IGltcG9ydGVkID0gcmVleHBvcnRzLmdldEltcG9ydCgpO1xuXG4gICAgICAvLyBpZiBpbXBvcnQgaXMgaWdub3JlZCwgcmV0dXJuIGV4cGxpY2l0ICdudWxsJ1xuICAgICAgaWYgKGltcG9ydGVkID09IG51bGwpIHJldHVybiB7IGZvdW5kOiB0cnVlLCBwYXRoOiBbdGhpc10gfTtcblxuICAgICAgLy8gc2FmZWd1YXJkIGFnYWluc3QgY3ljbGVzLCBvbmx5IGlmIG5hbWUgbWF0Y2hlc1xuICAgICAgaWYgKGltcG9ydGVkLnBhdGggPT09IHRoaXMucGF0aCAmJiByZWV4cG9ydHMubG9jYWwgPT09IG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHsgZm91bmQ6IGZhbHNlLCBwYXRoOiBbdGhpc10gfTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGVlcCA9IGltcG9ydGVkLmhhc0RlZXAocmVleHBvcnRzLmxvY2FsKTtcbiAgICAgIGRlZXAucGF0aC51bnNoaWZ0KHRoaXMpO1xuXG4gICAgICByZXR1cm4gZGVlcDtcbiAgICB9XG5cblxuICAgIC8vIGRlZmF1bHQgZXhwb3J0cyBtdXN0IGJlIGV4cGxpY2l0bHkgcmUtZXhwb3J0ZWQgKCMzMjgpXG4gICAgaWYgKG5hbWUgIT09ICdkZWZhdWx0Jykge1xuICAgICAgZm9yIChjb25zdCBkZXAgb2YgdGhpcy5kZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgY29uc3QgaW5uZXJNYXAgPSBkZXAoKTtcbiAgICAgICAgaWYgKGlubmVyTWFwID09IG51bGwpIHJldHVybiB7IGZvdW5kOiB0cnVlLCBwYXRoOiBbdGhpc10gfTtcbiAgICAgICAgLy8gdG9kbzogcmVwb3J0IGFzIHVucmVzb2x2ZWQ/XG4gICAgICAgIGlmICghaW5uZXJNYXApIGNvbnRpbnVlO1xuXG4gICAgICAgIC8vIHNhZmVndWFyZCBhZ2FpbnN0IGN5Y2xlc1xuICAgICAgICBpZiAoaW5uZXJNYXAucGF0aCA9PT0gdGhpcy5wYXRoKSBjb250aW51ZTtcblxuICAgICAgICBjb25zdCBpbm5lclZhbHVlID0gaW5uZXJNYXAuaGFzRGVlcChuYW1lKTtcbiAgICAgICAgaWYgKGlubmVyVmFsdWUuZm91bmQpIHtcbiAgICAgICAgICBpbm5lclZhbHVlLnBhdGgudW5zaGlmdCh0aGlzKTtcbiAgICAgICAgICByZXR1cm4gaW5uZXJWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IGZvdW5kOiBmYWxzZSwgcGF0aDogW3RoaXNdIH07XG4gIH1cblxuICBnZXQobmFtZSkge1xuICAgIGlmICh0aGlzLm5hbWVzcGFjZS5oYXMobmFtZSkpIHJldHVybiB0aGlzLm5hbWVzcGFjZS5nZXQobmFtZSk7XG5cbiAgICBpZiAodGhpcy5yZWV4cG9ydHMuaGFzKG5hbWUpKSB7XG4gICAgICBjb25zdCByZWV4cG9ydHMgPSB0aGlzLnJlZXhwb3J0cy5nZXQobmFtZSk7XG4gICAgICBjb25zdCBpbXBvcnRlZCA9IHJlZXhwb3J0cy5nZXRJbXBvcnQoKTtcblxuICAgICAgLy8gaWYgaW1wb3J0IGlzIGlnbm9yZWQsIHJldHVybiBleHBsaWNpdCAnbnVsbCdcbiAgICAgIGlmIChpbXBvcnRlZCA9PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICAgICAgLy8gc2FmZWd1YXJkIGFnYWluc3QgY3ljbGVzLCBvbmx5IGlmIG5hbWUgbWF0Y2hlc1xuICAgICAgaWYgKGltcG9ydGVkLnBhdGggPT09IHRoaXMucGF0aCAmJiByZWV4cG9ydHMubG9jYWwgPT09IG5hbWUpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAgIHJldHVybiBpbXBvcnRlZC5nZXQocmVleHBvcnRzLmxvY2FsKTtcbiAgICB9XG5cbiAgICAvLyBkZWZhdWx0IGV4cG9ydHMgbXVzdCBiZSBleHBsaWNpdGx5IHJlLWV4cG9ydGVkICgjMzI4KVxuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIGZvciAoY29uc3QgZGVwIG9mIHRoaXMuZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGNvbnN0IGlubmVyTWFwID0gZGVwKCk7XG4gICAgICAgIC8vIHRvZG86IHJlcG9ydCBhcyB1bnJlc29sdmVkP1xuICAgICAgICBpZiAoIWlubmVyTWFwKSBjb250aW51ZTtcblxuICAgICAgICAvLyBzYWZlZ3VhcmQgYWdhaW5zdCBjeWNsZXNcbiAgICAgICAgaWYgKGlubmVyTWFwLnBhdGggPT09IHRoaXMucGF0aCkgY29udGludWU7XG5cbiAgICAgICAgY29uc3QgaW5uZXJWYWx1ZSA9IGlubmVyTWFwLmdldChuYW1lKTtcbiAgICAgICAgaWYgKGlubmVyVmFsdWUgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGlubmVyVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICB0aGlzLm5hbWVzcGFjZS5mb3JFYWNoKCh2LCBuKSA9PlxuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2LCBuLCB0aGlzKSk7XG5cbiAgICB0aGlzLnJlZXhwb3J0cy5mb3JFYWNoKChyZWV4cG9ydHMsIG5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHJlZXhwb3J0ZWQgPSByZWV4cG9ydHMuZ2V0SW1wb3J0KCk7XG4gICAgICAvLyBjYW4ndCBsb29rIHVwIG1ldGEgZm9yIGlnbm9yZWQgcmUtZXhwb3J0cyAoIzM0OClcbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgcmVleHBvcnRlZCAmJiByZWV4cG9ydGVkLmdldChyZWV4cG9ydHMubG9jYWwpLCBuYW1lLCB0aGlzKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGVwZW5kZW5jaWVzLmZvckVhY2goZGVwID0+IHtcbiAgICAgIGNvbnN0IGQgPSBkZXAoKTtcbiAgICAgIC8vIENKUyAvIGlnbm9yZWQgZGVwZW5kZW5jaWVzIHdvbid0IGV4aXN0ICgjNzE3KVxuICAgICAgaWYgKGQgPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICBkLmZvckVhY2goKHYsIG4pID0+XG4gICAgICAgIG4gIT09ICdkZWZhdWx0JyAmJiBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHYsIG4sIHRoaXMpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHRvZG86IGtleXMsIHZhbHVlcywgZW50cmllcz9cblxuICByZXBvcnRFcnJvcnMoY29udGV4dCwgZGVjbGFyYXRpb24pIHtcbiAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICBub2RlOiBkZWNsYXJhdGlvbi5zb3VyY2UsXG4gICAgICBtZXNzYWdlOiBgUGFyc2UgZXJyb3JzIGluIGltcG9ydGVkIG1vZHVsZSAnJHtkZWNsYXJhdGlvbi5zb3VyY2UudmFsdWV9JzogYCArXG4gICAgICAgICAgICAgICAgICBgJHt0aGlzLmVycm9yc1xuICAgICAgICAgICAgICAgICAgICAubWFwKGUgPT4gYCR7ZS5tZXNzYWdlfSAoJHtlLmxpbmVOdW1iZXJ9OiR7ZS5jb2x1bW59KWApXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKCcsICcpfWAsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBwYXJzZSBkb2NzIGZyb20gdGhlIGZpcnN0IG5vZGUgdGhhdCBoYXMgbGVhZGluZyBjb21tZW50c1xuICovXG5mdW5jdGlvbiBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCAuLi5ub2Rlcykge1xuICBjb25zdCBtZXRhZGF0YSA9IHt9O1xuXG4gIC8vICdzb21lJyBzaG9ydC1jaXJjdWl0cyBvbiBmaXJzdCAndHJ1ZSdcbiAgbm9kZXMuc29tZShuID0+IHtcbiAgICB0cnkge1xuXG4gICAgICBsZXQgbGVhZGluZ0NvbW1lbnRzO1xuXG4gICAgICAvLyBuLmxlYWRpbmdDb21tZW50cyBpcyBsZWdhY3kgYGF0dGFjaENvbW1lbnRzYCBiZWhhdmlvclxuICAgICAgaWYgKCdsZWFkaW5nQ29tbWVudHMnIGluIG4pIHtcbiAgICAgICAgbGVhZGluZ0NvbW1lbnRzID0gbi5sZWFkaW5nQ29tbWVudHM7XG4gICAgICB9IGVsc2UgaWYgKG4ucmFuZ2UpIHtcbiAgICAgICAgbGVhZGluZ0NvbW1lbnRzID0gc291cmNlLmdldENvbW1lbnRzQmVmb3JlKG4pO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWxlYWRpbmdDb21tZW50cyB8fCBsZWFkaW5nQ29tbWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIGZvciAoY29uc3QgbmFtZSBpbiBkb2NTdHlsZVBhcnNlcnMpIHtcbiAgICAgICAgY29uc3QgZG9jID0gZG9jU3R5bGVQYXJzZXJzW25hbWVdKGxlYWRpbmdDb21tZW50cyk7XG4gICAgICAgIGlmIChkb2MpIHtcbiAgICAgICAgICBtZXRhZGF0YS5kb2MgPSBkb2M7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbWV0YWRhdGE7XG59XG5cbmNvbnN0IGF2YWlsYWJsZURvY1N0eWxlUGFyc2VycyA9IHtcbiAganNkb2M6IGNhcHR1cmVKc0RvYyxcbiAgdG9tZG9jOiBjYXB0dXJlVG9tRG9jLFxufTtcblxuLyoqXG4gKiBwYXJzZSBKU0RvYyBmcm9tIGxlYWRpbmcgY29tbWVudHNcbiAqIEBwYXJhbSB7b2JqZWN0W119IGNvbW1lbnRzXG4gKiBAcmV0dXJuIHt7IGRvYzogb2JqZWN0IH19XG4gKi9cbmZ1bmN0aW9uIGNhcHR1cmVKc0RvYyhjb21tZW50cykge1xuICBsZXQgZG9jO1xuXG4gIC8vIGNhcHR1cmUgWFNEb2NcbiAgY29tbWVudHMuZm9yRWFjaChjb21tZW50ID0+IHtcbiAgICAvLyBza2lwIG5vbi1ibG9jayBjb21tZW50c1xuICAgIGlmIChjb21tZW50LnR5cGUgIT09ICdCbG9jaycpIHJldHVybjtcbiAgICB0cnkge1xuICAgICAgZG9jID0gZG9jdHJpbmUucGFyc2UoY29tbWVudC52YWx1ZSwgeyB1bndyYXA6IHRydWUgfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvKiBkb24ndCBjYXJlLCBmb3Igbm93PyBtYXliZSBhZGQgdG8gYGVycm9ycz9gICovXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZG9jO1xufVxuXG4vKipcbiAgKiBwYXJzZSBUb21Eb2Mgc2VjdGlvbiBmcm9tIGNvbW1lbnRzXG4gICovXG5mdW5jdGlvbiBjYXB0dXJlVG9tRG9jKGNvbW1lbnRzKSB7XG4gIC8vIGNvbGxlY3QgbGluZXMgdXAgdG8gZmlyc3QgcGFyYWdyYXBoIGJyZWFrXG4gIGNvbnN0IGxpbmVzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29tbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjb21tZW50ID0gY29tbWVudHNbaV07XG4gICAgaWYgKGNvbW1lbnQudmFsdWUubWF0Y2goL15cXHMqJC8pKSBicmVhaztcbiAgICBsaW5lcy5wdXNoKGNvbW1lbnQudmFsdWUudHJpbSgpKTtcbiAgfVxuXG4gIC8vIHJldHVybiBkb2N0cmluZS1saWtlIG9iamVjdFxuICBjb25zdCBzdGF0dXNNYXRjaCA9IGxpbmVzLmpvaW4oJyAnKS5tYXRjaCgvXihQdWJsaWN8SW50ZXJuYWx8RGVwcmVjYXRlZCk6XFxzKiguKykvKTtcbiAgaWYgKHN0YXR1c01hdGNoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBzdGF0dXNNYXRjaFsyXSxcbiAgICAgIHRhZ3M6IFt7XG4gICAgICAgIHRpdGxlOiBzdGF0dXNNYXRjaFsxXS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBkZXNjcmlwdGlvbjogc3RhdHVzTWF0Y2hbMl0sXG4gICAgICB9XSxcbiAgICB9O1xuICB9XG59XG5cbmNvbnN0IHN1cHBvcnRlZEltcG9ydFR5cGVzID0gbmV3IFNldChbJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInLCAnSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyJ10pO1xuXG5FeHBvcnRNYXAuZ2V0ID0gZnVuY3Rpb24gKHNvdXJjZSwgY29udGV4dCkge1xuICBjb25zdCBwYXRoID0gcmVzb2x2ZShzb3VyY2UsIGNvbnRleHQpO1xuICBpZiAocGF0aCA9PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gRXhwb3J0TWFwLmZvcihjaGlsZENvbnRleHQocGF0aCwgY29udGV4dCkpO1xufTtcblxuRXhwb3J0TWFwLmZvciA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gIGNvbnN0IHsgcGF0aCB9ID0gY29udGV4dDtcblxuICBjb25zdCBjYWNoZUtleSA9IGhhc2hPYmplY3QoY29udGV4dCkuZGlnZXN0KCdoZXgnKTtcbiAgbGV0IGV4cG9ydE1hcCA9IGV4cG9ydENhY2hlLmdldChjYWNoZUtleSk7XG5cbiAgLy8gcmV0dXJuIGNhY2hlZCBpZ25vcmVcbiAgaWYgKGV4cG9ydE1hcCA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgc3RhdHMgPSBmcy5zdGF0U3luYyhwYXRoKTtcbiAgaWYgKGV4cG9ydE1hcCAhPSBudWxsKSB7XG4gICAgLy8gZGF0ZSBlcXVhbGl0eSBjaGVja1xuICAgIGlmIChleHBvcnRNYXAubXRpbWUgLSBzdGF0cy5tdGltZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIGV4cG9ydE1hcDtcbiAgICB9XG4gICAgLy8gZnV0dXJlOiBjaGVjayBjb250ZW50IGVxdWFsaXR5P1xuICB9XG5cbiAgLy8gY2hlY2sgdmFsaWQgZXh0ZW5zaW9ucyBmaXJzdFxuICBpZiAoIWhhc1ZhbGlkRXh0ZW5zaW9uKHBhdGgsIGNvbnRleHQpKSB7XG4gICAgZXhwb3J0Q2FjaGUuc2V0KGNhY2hlS2V5LCBudWxsKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIGNoZWNrIGZvciBhbmQgY2FjaGUgaWdub3JlXG4gIGlmIChpc0lnbm9yZWQocGF0aCwgY29udGV4dCkpIHtcbiAgICBsb2coJ2lnbm9yZWQgcGF0aCBkdWUgdG8gaWdub3JlIHNldHRpbmdzOicsIHBhdGgpO1xuICAgIGV4cG9ydENhY2hlLnNldChjYWNoZUtleSwgbnVsbCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKHBhdGgsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcblxuICAvLyBjaGVjayBmb3IgYW5kIGNhY2hlIHVuYW1iaWd1b3VzIG1vZHVsZXNcbiAgaWYgKCF1bmFtYmlndW91cy50ZXN0KGNvbnRlbnQpKSB7XG4gICAgbG9nKCdpZ25vcmVkIHBhdGggZHVlIHRvIHVuYW1iaWd1b3VzIHJlZ2V4OicsIHBhdGgpO1xuICAgIGV4cG9ydENhY2hlLnNldChjYWNoZUtleSwgbnVsbCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsb2coJ2NhY2hlIG1pc3MnLCBjYWNoZUtleSwgJ2ZvciBwYXRoJywgcGF0aCk7XG4gIGV4cG9ydE1hcCA9IEV4cG9ydE1hcC5wYXJzZShwYXRoLCBjb250ZW50LCBjb250ZXh0KTtcblxuICAvLyBhbWJpZ3VvdXMgbW9kdWxlcyByZXR1cm4gbnVsbFxuICBpZiAoZXhwb3J0TWFwID09IG51bGwpIHtcbiAgICBsb2coJ2lnbm9yZWQgcGF0aCBkdWUgdG8gYW1iaWd1b3VzIHBhcnNlOicsIHBhdGgpO1xuICAgIGV4cG9ydENhY2hlLnNldChjYWNoZUtleSwgbnVsbCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBleHBvcnRNYXAubXRpbWUgPSBzdGF0cy5tdGltZTtcblxuICBleHBvcnRDYWNoZS5zZXQoY2FjaGVLZXksIGV4cG9ydE1hcCk7XG4gIHJldHVybiBleHBvcnRNYXA7XG59O1xuXG5cbkV4cG9ydE1hcC5wYXJzZSA9IGZ1bmN0aW9uIChwYXRoLCBjb250ZW50LCBjb250ZXh0KSB7XG4gIGNvbnN0IG0gPSBuZXcgRXhwb3J0TWFwKHBhdGgpO1xuICBjb25zdCBpc0VzTW9kdWxlSW50ZXJvcFRydWUgPSBpc0VzTW9kdWxlSW50ZXJvcCgpO1xuXG4gIGxldCBhc3Q7XG4gIGxldCB2aXNpdG9yS2V5cztcbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBwYXJzZShwYXRoLCBjb250ZW50LCBjb250ZXh0KTtcbiAgICBhc3QgPSByZXN1bHQuYXN0O1xuICAgIHZpc2l0b3JLZXlzID0gcmVzdWx0LnZpc2l0b3JLZXlzO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBtLmVycm9ycy5wdXNoKGVycik7XG4gICAgcmV0dXJuIG07IC8vIGNhbid0IGNvbnRpbnVlXG4gIH1cblxuICBtLnZpc2l0b3JLZXlzID0gdmlzaXRvcktleXM7XG5cbiAgbGV0IGhhc0R5bmFtaWNJbXBvcnRzID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gcHJvY2Vzc0R5bmFtaWNJbXBvcnQoc291cmNlKSB7XG4gICAgaGFzRHluYW1pY0ltcG9ydHMgPSB0cnVlO1xuICAgIGlmIChzb3VyY2UudHlwZSAhPT0gJ0xpdGVyYWwnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgcCA9IHJlbW90ZVBhdGgoc291cmNlLnZhbHVlKTtcbiAgICBpZiAocCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgaW1wb3J0ZWRTcGVjaWZpZXJzID0gbmV3IFNldCgpO1xuICAgIGltcG9ydGVkU3BlY2lmaWVycy5hZGQoJ0ltcG9ydE5hbWVzcGFjZVNwZWNpZmllcicpO1xuICAgIGNvbnN0IGdldHRlciA9IHRodW5rRm9yKHAsIGNvbnRleHQpO1xuICAgIG0uaW1wb3J0cy5zZXQocCwge1xuICAgICAgZ2V0dGVyLFxuICAgICAgZGVjbGFyYXRpb25zOiBuZXcgU2V0KFt7XG4gICAgICAgIHNvdXJjZToge1xuICAgICAgICAvLyBjYXB0dXJpbmcgYWN0dWFsIG5vZGUgcmVmZXJlbmNlIGhvbGRzIGZ1bGwgQVNUIGluIG1lbW9yeSFcbiAgICAgICAgICB2YWx1ZTogc291cmNlLnZhbHVlLFxuICAgICAgICAgIGxvYzogc291cmNlLmxvYyxcbiAgICAgICAgfSxcbiAgICAgICAgaW1wb3J0ZWRTcGVjaWZpZXJzLFxuICAgICAgICBkeW5hbWljOiB0cnVlLFxuICAgICAgfV0pLFxuICAgIH0pO1xuICB9XG5cbiAgdmlzaXQoYXN0LCB2aXNpdG9yS2V5cywge1xuICAgIEltcG9ydEV4cHJlc3Npb24obm9kZSkge1xuICAgICAgcHJvY2Vzc0R5bmFtaWNJbXBvcnQobm9kZS5zb3VyY2UpO1xuICAgIH0sXG4gICAgQ2FsbEV4cHJlc3Npb24obm9kZSkge1xuICAgICAgaWYgKG5vZGUuY2FsbGVlLnR5cGUgPT09ICdJbXBvcnQnKSB7XG4gICAgICAgIHByb2Nlc3NEeW5hbWljSW1wb3J0KG5vZGUuYXJndW1lbnRzWzBdKTtcbiAgICAgIH1cbiAgICB9LFxuICB9KTtcblxuICBjb25zdCB1bmFtYmlndW91c2x5RVNNID0gdW5hbWJpZ3VvdXMuaXNNb2R1bGUoYXN0KTtcbiAgaWYgKCF1bmFtYmlndW91c2x5RVNNICYmICFoYXNEeW5hbWljSW1wb3J0cykgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgZG9jc3R5bGUgPSAoY29udGV4dC5zZXR0aW5ncyAmJiBjb250ZXh0LnNldHRpbmdzWydpbXBvcnQvZG9jc3R5bGUnXSkgfHwgWydqc2RvYyddO1xuICBjb25zdCBkb2NTdHlsZVBhcnNlcnMgPSB7fTtcbiAgZG9jc3R5bGUuZm9yRWFjaChzdHlsZSA9PiB7XG4gICAgZG9jU3R5bGVQYXJzZXJzW3N0eWxlXSA9IGF2YWlsYWJsZURvY1N0eWxlUGFyc2Vyc1tzdHlsZV07XG4gIH0pO1xuXG4gIC8vIGF0dGVtcHQgdG8gY29sbGVjdCBtb2R1bGUgZG9jXG4gIGlmIChhc3QuY29tbWVudHMpIHtcbiAgICBhc3QuY29tbWVudHMuc29tZShjID0+IHtcbiAgICAgIGlmIChjLnR5cGUgIT09ICdCbG9jaycpIHJldHVybiBmYWxzZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRvYyA9IGRvY3RyaW5lLnBhcnNlKGMudmFsdWUsIHsgdW53cmFwOiB0cnVlIH0pO1xuICAgICAgICBpZiAoZG9jLnRhZ3Muc29tZSh0ID0+IHQudGl0bGUgPT09ICdtb2R1bGUnKSkge1xuICAgICAgICAgIG0uZG9jID0gZG9jO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHsgLyogaWdub3JlICovIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IG5hbWVzcGFjZXMgPSBuZXcgTWFwKCk7XG5cbiAgZnVuY3Rpb24gcmVtb3RlUGF0aCh2YWx1ZSkge1xuICAgIHJldHVybiByZXNvbHZlLnJlbGF0aXZlKHZhbHVlLCBwYXRoLCBjb250ZXh0LnNldHRpbmdzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVJbXBvcnQodmFsdWUpIHtcbiAgICBjb25zdCBycCA9IHJlbW90ZVBhdGgodmFsdWUpO1xuICAgIGlmIChycCA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gRXhwb3J0TWFwLmZvcihjaGlsZENvbnRleHQocnAsIGNvbnRleHQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE5hbWVzcGFjZShpZGVudGlmaWVyKSB7XG4gICAgaWYgKCFuYW1lc3BhY2VzLmhhcyhpZGVudGlmaWVyLm5hbWUpKSByZXR1cm47XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHJlc29sdmVJbXBvcnQobmFtZXNwYWNlcy5nZXQoaWRlbnRpZmllci5uYW1lKSk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZE5hbWVzcGFjZShvYmplY3QsIGlkZW50aWZpZXIpIHtcbiAgICBjb25zdCBuc2ZuID0gZ2V0TmFtZXNwYWNlKGlkZW50aWZpZXIpO1xuICAgIGlmIChuc2ZuKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnbmFtZXNwYWNlJywgeyBnZXQ6IG5zZm4gfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb2Nlc3NTcGVjaWZpZXIocywgbiwgbSkge1xuICAgIGNvbnN0IG5zb3VyY2UgPSBuLnNvdXJjZSAmJiBuLnNvdXJjZS52YWx1ZTtcbiAgICBjb25zdCBleHBvcnRNZXRhID0ge307XG4gICAgbGV0IGxvY2FsO1xuXG4gICAgc3dpdGNoIChzLnR5cGUpIHtcbiAgICBjYXNlICdFeHBvcnREZWZhdWx0U3BlY2lmaWVyJzpcbiAgICAgIGlmICghbnNvdXJjZSkgcmV0dXJuO1xuICAgICAgbG9jYWwgPSAnZGVmYXVsdCc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdFeHBvcnROYW1lc3BhY2VTcGVjaWZpZXInOlxuICAgICAgbS5uYW1lc3BhY2Uuc2V0KHMuZXhwb3J0ZWQubmFtZSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydE1ldGEsICduYW1lc3BhY2UnLCB7XG4gICAgICAgIGdldCgpIHsgcmV0dXJuIHJlc29sdmVJbXBvcnQobnNvdXJjZSk7IH0sXG4gICAgICB9KSk7XG4gICAgICByZXR1cm47XG4gICAgY2FzZSAnRXhwb3J0QWxsRGVjbGFyYXRpb24nOlxuICAgICAgbS5uYW1lc3BhY2Uuc2V0KHMuZXhwb3J0ZWQubmFtZSB8fCBzLmV4cG9ydGVkLnZhbHVlLCBhZGROYW1lc3BhY2UoZXhwb3J0TWV0YSwgcy5zb3VyY2UudmFsdWUpKTtcbiAgICAgIHJldHVybjtcbiAgICBjYXNlICdFeHBvcnRTcGVjaWZpZXInOlxuICAgICAgaWYgKCFuLnNvdXJjZSkge1xuICAgICAgICBtLm5hbWVzcGFjZS5zZXQocy5leHBvcnRlZC5uYW1lIHx8IHMuZXhwb3J0ZWQudmFsdWUsIGFkZE5hbWVzcGFjZShleHBvcnRNZXRhLCBzLmxvY2FsKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIGVsc2UgZmFsbHMgdGhyb3VnaFxuICAgIGRlZmF1bHQ6XG4gICAgICBsb2NhbCA9IHMubG9jYWwubmFtZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIHRvZG86IEpTRG9jXG4gICAgbS5yZWV4cG9ydHMuc2V0KHMuZXhwb3J0ZWQubmFtZSwgeyBsb2NhbCwgZ2V0SW1wb3J0OiAoKSA9PiByZXNvbHZlSW1wb3J0KG5zb3VyY2UpIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FwdHVyZURlcGVuZGVuY3lXaXRoU3BlY2lmaWVycyhuKSB7XG4gICAgLy8gaW1wb3J0IHR5cGUgeyBGb28gfSAoVFMgYW5kIEZsb3cpOyBpbXBvcnQgdHlwZW9mIHsgRm9vIH0gKEZsb3cpXG4gICAgY29uc3QgZGVjbGFyYXRpb25Jc1R5cGUgPSBuLmltcG9ydEtpbmQgPT09ICd0eXBlJyB8fCBuLmltcG9ydEtpbmQgPT09ICd0eXBlb2YnO1xuICAgIC8vIGltcG9ydCAnLi9mb28nIG9yIGltcG9ydCB7fSBmcm9tICcuL2ZvbycgKGJvdGggMCBzcGVjaWZpZXJzKSBpcyBhIHNpZGUgZWZmZWN0IGFuZFxuICAgIC8vIHNob3VsZG4ndCBiZSBjb25zaWRlcmVkIHRvIGJlIGp1c3QgaW1wb3J0aW5nIHR5cGVzXG4gICAgbGV0IHNwZWNpZmllcnNPbmx5SW1wb3J0aW5nVHlwZXMgPSBuLnNwZWNpZmllcnMubGVuZ3RoID4gMDtcbiAgICBjb25zdCBpbXBvcnRlZFNwZWNpZmllcnMgPSBuZXcgU2V0KCk7XG4gICAgbi5zcGVjaWZpZXJzLmZvckVhY2goc3BlY2lmaWVyID0+IHtcbiAgICAgIGlmIChzcGVjaWZpZXIudHlwZSA9PT0gJ0ltcG9ydFNwZWNpZmllcicpIHtcbiAgICAgICAgaW1wb3J0ZWRTcGVjaWZpZXJzLmFkZChzcGVjaWZpZXIuaW1wb3J0ZWQubmFtZSB8fCBzcGVjaWZpZXIuaW1wb3J0ZWQudmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0ZWRJbXBvcnRUeXBlcy5oYXMoc3BlY2lmaWVyLnR5cGUpKSB7XG4gICAgICAgIGltcG9ydGVkU3BlY2lmaWVycy5hZGQoc3BlY2lmaWVyLnR5cGUpO1xuICAgICAgfVxuXG4gICAgICAvLyBpbXBvcnQgeyB0eXBlIEZvbyB9IChGbG93KTsgaW1wb3J0IHsgdHlwZW9mIEZvbyB9IChGbG93KVxuICAgICAgc3BlY2lmaWVyc09ubHlJbXBvcnRpbmdUeXBlcyA9IHNwZWNpZmllcnNPbmx5SW1wb3J0aW5nVHlwZXNcbiAgICAgICAgJiYgKHNwZWNpZmllci5pbXBvcnRLaW5kID09PSAndHlwZScgfHwgc3BlY2lmaWVyLmltcG9ydEtpbmQgPT09ICd0eXBlb2YnKTtcbiAgICB9KTtcbiAgICBjYXB0dXJlRGVwZW5kZW5jeShuLCBkZWNsYXJhdGlvbklzVHlwZSB8fCBzcGVjaWZpZXJzT25seUltcG9ydGluZ1R5cGVzLCBpbXBvcnRlZFNwZWNpZmllcnMpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FwdHVyZURlcGVuZGVuY3koeyBzb3VyY2UgfSwgaXNPbmx5SW1wb3J0aW5nVHlwZXMsIGltcG9ydGVkU3BlY2lmaWVycyA9IG5ldyBTZXQoKSkge1xuICAgIGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBwID0gcmVtb3RlUGF0aChzb3VyY2UudmFsdWUpO1xuICAgIGlmIChwID09IG51bGwpIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgZGVjbGFyYXRpb25NZXRhZGF0YSA9IHtcbiAgICAgIC8vIGNhcHR1cmluZyBhY3R1YWwgbm9kZSByZWZlcmVuY2UgaG9sZHMgZnVsbCBBU1QgaW4gbWVtb3J5IVxuICAgICAgc291cmNlOiB7IHZhbHVlOiBzb3VyY2UudmFsdWUsIGxvYzogc291cmNlLmxvYyB9LFxuICAgICAgaXNPbmx5SW1wb3J0aW5nVHlwZXMsXG4gICAgICBpbXBvcnRlZFNwZWNpZmllcnMsXG4gICAgfTtcblxuICAgIGNvbnN0IGV4aXN0aW5nID0gbS5pbXBvcnRzLmdldChwKTtcbiAgICBpZiAoZXhpc3RpbmcgIT0gbnVsbCkge1xuICAgICAgZXhpc3RpbmcuZGVjbGFyYXRpb25zLmFkZChkZWNsYXJhdGlvbk1ldGFkYXRhKTtcbiAgICAgIHJldHVybiBleGlzdGluZy5nZXR0ZXI7XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0dGVyID0gdGh1bmtGb3IocCwgY29udGV4dCk7XG4gICAgbS5pbXBvcnRzLnNldChwLCB7IGdldHRlciwgZGVjbGFyYXRpb25zOiBuZXcgU2V0KFtkZWNsYXJhdGlvbk1ldGFkYXRhXSkgfSk7XG4gICAgcmV0dXJuIGdldHRlcjtcbiAgfVxuXG4gIGNvbnN0IHNvdXJjZSA9IG1ha2VTb3VyY2VDb2RlKGNvbnRlbnQsIGFzdCk7XG5cbiAgZnVuY3Rpb24gcmVhZFRzQ29uZmlnKGNvbnRleHQpIHtcbiAgICBjb25zdCB0c0NvbmZpZ0luZm8gPSB0c0NvbmZpZ0xvYWRlcih7XG4gICAgICBjd2Q6XG4gICAgICAgIChjb250ZXh0LnBhcnNlck9wdGlvbnMgJiYgY29udGV4dC5wYXJzZXJPcHRpb25zLnRzY29uZmlnUm9vdERpcikgfHxcbiAgICAgICAgcHJvY2Vzcy5jd2QoKSxcbiAgICAgIGdldEVudjogKGtleSkgPT4gcHJvY2Vzcy5lbnZba2V5XSxcbiAgICB9KTtcbiAgICB0cnkge1xuICAgICAgaWYgKHRzQ29uZmlnSW5mby50c0NvbmZpZ1BhdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBQcm9qZWN0cyBub3QgdXNpbmcgVHlwZVNjcmlwdCB3b24ndCBoYXZlIGB0eXBlc2NyaXB0YCBpbnN0YWxsZWQuXG4gICAgICAgIGlmICghdHMpIHsgdHMgPSByZXF1aXJlKCd0eXBlc2NyaXB0Jyk7IH1cbiAgXG4gICAgICAgIGNvbnN0IGNvbmZpZ0ZpbGUgPSB0cy5yZWFkQ29uZmlnRmlsZSh0c0NvbmZpZ0luZm8udHNDb25maWdQYXRoLCB0cy5zeXMucmVhZEZpbGUpO1xuICAgICAgICByZXR1cm4gdHMucGFyc2VKc29uQ29uZmlnRmlsZUNvbnRlbnQoXG4gICAgICAgICAgY29uZmlnRmlsZS5jb25maWcsXG4gICAgICAgICAgdHMuc3lzLFxuICAgICAgICAgIGRpcm5hbWUodHNDb25maWdJbmZvLnRzQ29uZmlnUGF0aCksXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gQ2F0Y2ggYW55IGVycm9yc1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNFc01vZHVsZUludGVyb3AoKSB7XG4gICAgY29uc3QgY2FjaGVLZXkgPSBoYXNoT2JqZWN0KHtcbiAgICAgIHRzY29uZmlnUm9vdERpcjogY29udGV4dC5wYXJzZXJPcHRpb25zICYmIGNvbnRleHQucGFyc2VyT3B0aW9ucy50c2NvbmZpZ1Jvb3REaXIsXG4gICAgfSkuZGlnZXN0KCdoZXgnKTtcbiAgICBsZXQgdHNDb25maWcgPSB0c0NvbmZpZ0NhY2hlLmdldChjYWNoZUtleSk7XG4gICAgaWYgKHR5cGVvZiB0c0NvbmZpZyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRzQ29uZmlnID0gcmVhZFRzQ29uZmlnKGNvbnRleHQpO1xuICAgICAgdHNDb25maWdDYWNoZS5zZXQoY2FjaGVLZXksIHRzQ29uZmlnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHNDb25maWcgJiYgdHNDb25maWcub3B0aW9ucyA/IHRzQ29uZmlnLm9wdGlvbnMuZXNNb2R1bGVJbnRlcm9wIDogZmFsc2U7XG4gIH1cblxuICBhc3QuYm9keS5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgaWYgKG4udHlwZSA9PT0gJ0V4cG9ydERlZmF1bHREZWNsYXJhdGlvbicpIHtcbiAgICAgIGNvbnN0IGV4cG9ydE1ldGEgPSBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBuKTtcbiAgICAgIGlmIChuLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdJZGVudGlmaWVyJykge1xuICAgICAgICBhZGROYW1lc3BhY2UoZXhwb3J0TWV0YSwgbi5kZWNsYXJhdGlvbik7XG4gICAgICB9XG4gICAgICBtLm5hbWVzcGFjZS5zZXQoJ2RlZmF1bHQnLCBleHBvcnRNZXRhKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobi50eXBlID09PSAnRXhwb3J0QWxsRGVjbGFyYXRpb24nKSB7XG4gICAgICBjb25zdCBnZXR0ZXIgPSBjYXB0dXJlRGVwZW5kZW5jeShuLCBuLmV4cG9ydEtpbmQgPT09ICd0eXBlJyk7XG4gICAgICBpZiAoZ2V0dGVyKSBtLmRlcGVuZGVuY2llcy5hZGQoZ2V0dGVyKTtcbiAgICAgIGlmIChuLmV4cG9ydGVkKSB7XG4gICAgICAgIHByb2Nlc3NTcGVjaWZpZXIobiwgbi5leHBvcnRlZCwgbSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gY2FwdHVyZSBuYW1lc3BhY2VzIGluIGNhc2Ugb2YgbGF0ZXIgZXhwb3J0XG4gICAgaWYgKG4udHlwZSA9PT0gJ0ltcG9ydERlY2xhcmF0aW9uJykge1xuICAgICAgY2FwdHVyZURlcGVuZGVuY3lXaXRoU3BlY2lmaWVycyhuKTtcblxuICAgICAgY29uc3QgbnMgPSBuLnNwZWNpZmllcnMuZmluZChzID0+IHMudHlwZSA9PT0gJ0ltcG9ydE5hbWVzcGFjZVNwZWNpZmllcicpO1xuICAgICAgaWYgKG5zKSB7XG4gICAgICAgIG5hbWVzcGFjZXMuc2V0KG5zLmxvY2FsLm5hbWUsIG4uc291cmNlLnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobi50eXBlID09PSAnRXhwb3J0TmFtZWREZWNsYXJhdGlvbicpIHtcbiAgICAgIGNhcHR1cmVEZXBlbmRlbmN5V2l0aFNwZWNpZmllcnMobik7XG5cbiAgICAgIC8vIGNhcHR1cmUgZGVjbGFyYXRpb25cbiAgICAgIGlmIChuLmRlY2xhcmF0aW9uICE9IG51bGwpIHtcbiAgICAgICAgc3dpdGNoIChuLmRlY2xhcmF0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnRnVuY3Rpb25EZWNsYXJhdGlvbic6XG4gICAgICAgIGNhc2UgJ0NsYXNzRGVjbGFyYXRpb24nOlxuICAgICAgICBjYXNlICdUeXBlQWxpYXMnOiAvLyBmbG93dHlwZSB3aXRoIGJhYmVsLWVzbGludCBwYXJzZXJcbiAgICAgICAgY2FzZSAnSW50ZXJmYWNlRGVjbGFyYXRpb24nOlxuICAgICAgICBjYXNlICdEZWNsYXJlRnVuY3Rpb24nOlxuICAgICAgICBjYXNlICdUU0RlY2xhcmVGdW5jdGlvbic6XG4gICAgICAgIGNhc2UgJ1RTRW51bURlY2xhcmF0aW9uJzpcbiAgICAgICAgY2FzZSAnVFNUeXBlQWxpYXNEZWNsYXJhdGlvbic6XG4gICAgICAgIGNhc2UgJ1RTSW50ZXJmYWNlRGVjbGFyYXRpb24nOlxuICAgICAgICBjYXNlICdUU0Fic3RyYWN0Q2xhc3NEZWNsYXJhdGlvbic6XG4gICAgICAgIGNhc2UgJ1RTTW9kdWxlRGVjbGFyYXRpb24nOlxuICAgICAgICAgIG0ubmFtZXNwYWNlLnNldChuLmRlY2xhcmF0aW9uLmlkLm5hbWUsIGNhcHR1cmVEb2Moc291cmNlLCBkb2NTdHlsZVBhcnNlcnMsIG4pKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnVmFyaWFibGVEZWNsYXJhdGlvbic6XG4gICAgICAgICAgbi5kZWNsYXJhdGlvbi5kZWNsYXJhdGlvbnMuZm9yRWFjaCgoZCkgPT5cbiAgICAgICAgICAgIHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlKGQuaWQsXG4gICAgICAgICAgICAgIGlkID0+IG0ubmFtZXNwYWNlLnNldChpZC5uYW1lLCBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBkLCBuKSkpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBuLnNwZWNpZmllcnMuZm9yRWFjaCgocykgPT4gcHJvY2Vzc1NwZWNpZmllcihzLCBuLCBtKSk7XG4gICAgfVxuXG4gICAgY29uc3QgZXhwb3J0cyA9IFsnVFNFeHBvcnRBc3NpZ25tZW50J107XG4gICAgaWYgKGlzRXNNb2R1bGVJbnRlcm9wVHJ1ZSkge1xuICAgICAgZXhwb3J0cy5wdXNoKCdUU05hbWVzcGFjZUV4cG9ydERlY2xhcmF0aW9uJyk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBkb2Vzbid0IGRlY2xhcmUgYW55dGhpbmcsIGJ1dCBjaGFuZ2VzIHdoYXQncyBiZWluZyBleHBvcnRlZC5cbiAgICBpZiAoaW5jbHVkZXMoZXhwb3J0cywgbi50eXBlKSkge1xuICAgICAgY29uc3QgZXhwb3J0ZWROYW1lID0gbi50eXBlID09PSAnVFNOYW1lc3BhY2VFeHBvcnREZWNsYXJhdGlvbidcbiAgICAgICAgPyAobi5pZCB8fCBuLm5hbWUpLm5hbWVcbiAgICAgICAgOiAobi5leHByZXNzaW9uICYmIG4uZXhwcmVzc2lvbi5uYW1lIHx8IChuLmV4cHJlc3Npb24uaWQgJiYgbi5leHByZXNzaW9uLmlkLm5hbWUpIHx8IG51bGwpO1xuICAgICAgY29uc3QgZGVjbFR5cGVzID0gW1xuICAgICAgICAnVmFyaWFibGVEZWNsYXJhdGlvbicsXG4gICAgICAgICdDbGFzc0RlY2xhcmF0aW9uJyxcbiAgICAgICAgJ1RTRGVjbGFyZUZ1bmN0aW9uJyxcbiAgICAgICAgJ1RTRW51bURlY2xhcmF0aW9uJyxcbiAgICAgICAgJ1RTVHlwZUFsaWFzRGVjbGFyYXRpb24nLFxuICAgICAgICAnVFNJbnRlcmZhY2VEZWNsYXJhdGlvbicsXG4gICAgICAgICdUU0Fic3RyYWN0Q2xhc3NEZWNsYXJhdGlvbicsXG4gICAgICAgICdUU01vZHVsZURlY2xhcmF0aW9uJyxcbiAgICAgIF07XG4gICAgICBjb25zdCBleHBvcnRlZERlY2xzID0gYXN0LmJvZHkuZmlsdGVyKCh7IHR5cGUsIGlkLCBkZWNsYXJhdGlvbnMgfSkgPT4gaW5jbHVkZXMoZGVjbFR5cGVzLCB0eXBlKSAmJiAoXG4gICAgICAgIChpZCAmJiBpZC5uYW1lID09PSBleHBvcnRlZE5hbWUpIHx8IChkZWNsYXJhdGlvbnMgJiYgZGVjbGFyYXRpb25zLmZpbmQoKGQpID0+IGQuaWQubmFtZSA9PT0gZXhwb3J0ZWROYW1lKSlcbiAgICAgICkpO1xuICAgICAgaWYgKGV4cG9ydGVkRGVjbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIEV4cG9ydCBpcyBub3QgcmVmZXJlbmNpbmcgYW55IGxvY2FsIGRlY2xhcmF0aW9uLCBtdXN0IGJlIHJlLWV4cG9ydGluZ1xuICAgICAgICBtLm5hbWVzcGFjZS5zZXQoJ2RlZmF1bHQnLCBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBuKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgaXNFc01vZHVsZUludGVyb3BUcnVlIC8vIGVzTW9kdWxlSW50ZXJvcCBpcyBvbiBpbiB0c2NvbmZpZ1xuICAgICAgICAmJiAhbS5uYW1lc3BhY2UuaGFzKCdkZWZhdWx0JykgLy8gYW5kIGRlZmF1bHQgaXNuJ3QgYWRkZWQgYWxyZWFkeVxuICAgICAgKSB7XG4gICAgICAgIG0ubmFtZXNwYWNlLnNldCgnZGVmYXVsdCcsIHt9KTsgLy8gYWRkIGRlZmF1bHQgZXhwb3J0XG4gICAgICB9XG4gICAgICBleHBvcnRlZERlY2xzLmZvckVhY2goKGRlY2wpID0+IHtcbiAgICAgICAgaWYgKGRlY2wudHlwZSA9PT0gJ1RTTW9kdWxlRGVjbGFyYXRpb24nKSB7XG4gICAgICAgICAgaWYgKGRlY2wuYm9keSAmJiBkZWNsLmJvZHkudHlwZSA9PT0gJ1RTTW9kdWxlRGVjbGFyYXRpb24nKSB7XG4gICAgICAgICAgICBtLm5hbWVzcGFjZS5zZXQoZGVjbC5ib2R5LmlkLm5hbWUsIGNhcHR1cmVEb2Moc291cmNlLCBkb2NTdHlsZVBhcnNlcnMsIGRlY2wuYm9keSkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGVjbC5ib2R5ICYmIGRlY2wuYm9keS5ib2R5KSB7XG4gICAgICAgICAgICBkZWNsLmJvZHkuYm9keS5mb3JFYWNoKChtb2R1bGVCbG9ja05vZGUpID0+IHtcbiAgICAgICAgICAgICAgLy8gRXhwb3J0LWFzc2lnbm1lbnQgZXhwb3J0cyBhbGwgbWVtYmVycyBpbiB0aGUgbmFtZXNwYWNlLFxuICAgICAgICAgICAgICAvLyBleHBsaWNpdGx5IGV4cG9ydGVkIG9yIG5vdC5cbiAgICAgICAgICAgICAgY29uc3QgbmFtZXNwYWNlRGVjbCA9IG1vZHVsZUJsb2NrTm9kZS50eXBlID09PSAnRXhwb3J0TmFtZWREZWNsYXJhdGlvbicgP1xuICAgICAgICAgICAgICAgIG1vZHVsZUJsb2NrTm9kZS5kZWNsYXJhdGlvbiA6XG4gICAgICAgICAgICAgICAgbW9kdWxlQmxvY2tOb2RlO1xuXG4gICAgICAgICAgICAgIGlmICghbmFtZXNwYWNlRGVjbCkge1xuICAgICAgICAgICAgICAgIC8vIFR5cGVTY3JpcHQgY2FuIGNoZWNrIHRoaXMgZm9yIHVzOyB3ZSBuZWVkbid0XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAobmFtZXNwYWNlRGVjbC50eXBlID09PSAnVmFyaWFibGVEZWNsYXJhdGlvbicpIHtcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2VEZWNsLmRlY2xhcmF0aW9ucy5mb3JFYWNoKChkKSA9PlxuICAgICAgICAgICAgICAgICAgcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUoZC5pZCwgKGlkKSA9PiBtLm5hbWVzcGFjZS5zZXQoXG4gICAgICAgICAgICAgICAgICAgIGlkLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGNhcHR1cmVEb2Moc291cmNlLCBkb2NTdHlsZVBhcnNlcnMsIGRlY2wsIG5hbWVzcGFjZURlY2wsIG1vZHVsZUJsb2NrTm9kZSksXG4gICAgICAgICAgICAgICAgICApKSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG0ubmFtZXNwYWNlLnNldChcbiAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZURlY2wuaWQubmFtZSxcbiAgICAgICAgICAgICAgICAgIGNhcHR1cmVEb2Moc291cmNlLCBkb2NTdHlsZVBhcnNlcnMsIG1vZHVsZUJsb2NrTm9kZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRXhwb3J0IGFzIGRlZmF1bHRcbiAgICAgICAgICBtLm5hbWVzcGFjZS5zZXQoJ2RlZmF1bHQnLCBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBkZWNsKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKFxuICAgIGlzRXNNb2R1bGVJbnRlcm9wVHJ1ZSAvLyBlc01vZHVsZUludGVyb3AgaXMgb24gaW4gdHNjb25maWdcbiAgICAmJiBtLm5hbWVzcGFjZS5zaXplID4gMCAvLyBhbnl0aGluZyBpcyBleHBvcnRlZFxuICAgICYmICFtLm5hbWVzcGFjZS5oYXMoJ2RlZmF1bHQnKSAvLyBhbmQgZGVmYXVsdCBpc24ndCBhZGRlZCBhbHJlYWR5XG4gICkge1xuICAgIG0ubmFtZXNwYWNlLnNldCgnZGVmYXVsdCcsIHt9KTsgLy8gYWRkIGRlZmF1bHQgZXhwb3J0XG4gIH1cblxuICBpZiAodW5hbWJpZ3VvdXNseUVTTSkge1xuICAgIG0ucGFyc2VHb2FsID0gJ01vZHVsZSc7XG4gIH1cbiAgcmV0dXJuIG07XG59O1xuXG4vKipcbiAqIFRoZSBjcmVhdGlvbiBvZiB0aGlzIGNsb3N1cmUgaXMgaXNvbGF0ZWQgZnJvbSBvdGhlciBzY29wZXNcbiAqIHRvIGF2b2lkIG92ZXItcmV0ZW50aW9uIG9mIHVucmVsYXRlZCB2YXJpYWJsZXMsIHdoaWNoIGhhc1xuICogY2F1c2VkIG1lbW9yeSBsZWFrcy4gU2VlICMxMjY2LlxuICovXG5mdW5jdGlvbiB0aHVua0ZvcihwLCBjb250ZXh0KSB7XG4gIHJldHVybiAoKSA9PiBFeHBvcnRNYXAuZm9yKGNoaWxkQ29udGV4dChwLCBjb250ZXh0KSk7XG59XG5cblxuLyoqXG4gKiBUcmF2ZXJzZSBhIHBhdHRlcm4vaWRlbnRpZmllciBub2RlLCBjYWxsaW5nICdjYWxsYmFjaydcbiAqIGZvciBlYWNoIGxlYWYgaWRlbnRpZmllci5cbiAqIEBwYXJhbSAge25vZGV9ICAgcGF0dGVyblxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUocGF0dGVybiwgY2FsbGJhY2spIHtcbiAgc3dpdGNoIChwYXR0ZXJuLnR5cGUpIHtcbiAgY2FzZSAnSWRlbnRpZmllcic6IC8vIGJhc2UgY2FzZVxuICAgIGNhbGxiYWNrKHBhdHRlcm4pO1xuICAgIGJyZWFrO1xuXG4gIGNhc2UgJ09iamVjdFBhdHRlcm4nOlxuICAgIHBhdHRlcm4ucHJvcGVydGllcy5mb3JFYWNoKHAgPT4ge1xuICAgICAgaWYgKHAudHlwZSA9PT0gJ0V4cGVyaW1lbnRhbFJlc3RQcm9wZXJ0eScgfHwgcC50eXBlID09PSAnUmVzdEVsZW1lbnQnKSB7XG4gICAgICAgIGNhbGxiYWNrKHAuYXJndW1lbnQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZShwLnZhbHVlLCBjYWxsYmFjayk7XG4gICAgfSk7XG4gICAgYnJlYWs7XG5cbiAgY2FzZSAnQXJyYXlQYXR0ZXJuJzpcbiAgICBwYXR0ZXJuLmVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGlmIChlbGVtZW50ID09IG51bGwpIHJldHVybjtcbiAgICAgIGlmIChlbGVtZW50LnR5cGUgPT09ICdFeHBlcmltZW50YWxSZXN0UHJvcGVydHknIHx8IGVsZW1lbnQudHlwZSA9PT0gJ1Jlc3RFbGVtZW50Jykge1xuICAgICAgICBjYWxsYmFjayhlbGVtZW50LmFyZ3VtZW50KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUoZWxlbWVudCwgY2FsbGJhY2spO1xuICAgIH0pO1xuICAgIGJyZWFrO1xuXG4gIGNhc2UgJ0Fzc2lnbm1lbnRQYXR0ZXJuJzpcbiAgICBjYWxsYmFjayhwYXR0ZXJuLmxlZnQpO1xuICAgIGJyZWFrO1xuICB9XG59XG5cbi8qKlxuICogZG9uJ3QgaG9sZCBmdWxsIGNvbnRleHQgb2JqZWN0IGluIG1lbW9yeSwganVzdCBncmFiIHdoYXQgd2UgbmVlZC5cbiAqL1xuZnVuY3Rpb24gY2hpbGRDb250ZXh0KHBhdGgsIGNvbnRleHQpIHtcbiAgY29uc3QgeyBzZXR0aW5ncywgcGFyc2VyT3B0aW9ucywgcGFyc2VyUGF0aCB9ID0gY29udGV4dDtcbiAgcmV0dXJuIHtcbiAgICBzZXR0aW5ncyxcbiAgICBwYXJzZXJPcHRpb25zLFxuICAgIHBhcnNlclBhdGgsXG4gICAgcGF0aCxcbiAgfTtcbn1cblxuXG4vKipcbiAqIHNvbWV0aW1lcyBsZWdhY3kgc3VwcG9ydCBpc24ndCBfdGhhdF8gaGFyZC4uLiByaWdodD9cbiAqL1xuZnVuY3Rpb24gbWFrZVNvdXJjZUNvZGUodGV4dCwgYXN0KSB7XG4gIGlmIChTb3VyY2VDb2RlLmxlbmd0aCA+IDEpIHtcbiAgICAvLyBFU0xpbnQgM1xuICAgIHJldHVybiBuZXcgU291cmNlQ29kZSh0ZXh0LCBhc3QpO1xuICB9IGVsc2Uge1xuICAgIC8vIEVTTGludCA0LCA1XG4gICAgcmV0dXJuIG5ldyBTb3VyY2VDb2RlKHsgdGV4dCwgYXN0IH0pO1xuICB9XG59XG4iXX0=