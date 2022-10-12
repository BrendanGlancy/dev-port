"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasZeroOrOneAsteriskCharacter = hasZeroOrOneAsteriskCharacter;
exports.pathIsRelative = pathIsRelative;
exports.tryParsePattern = tryParsePattern;
exports.findBestPatternMatch = findBestPatternMatch;
exports.matchPatternOrExact = matchPatternOrExact;
exports.isString = isString;
exports.matchedText = matchedText;
exports.patternText = patternText;
var _path = _interopRequireDefault(require("path"));
var _debug = require("next/dist/compiled/debug");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const log = (0, _debug).debug('next:jsconfig-paths-plugin');
const asterisk = 42;
function hasZeroOrOneAsteriskCharacter(str) {
    let seenAsterisk = false;
    for(let i = 0; i < str.length; i++){
        if (str.charCodeAt(i) === asterisk) {
            if (!seenAsterisk) {
                seenAsterisk = true;
            } else {
                // have already seen asterisk
                return false;
            }
        }
    }
    return true;
}
function pathIsRelative(testPath) {
    return /^\.\.?($|[\\/])/.test(testPath);
}
function tryParsePattern(pattern) {
    // This should be verified outside of here and a proper error thrown.
    const indexOfStar = pattern.indexOf('*');
    return indexOfStar === -1 ? undefined : {
        prefix: pattern.substr(0, indexOfStar),
        suffix: pattern.substr(indexOfStar + 1)
    };
}
function isPatternMatch({ prefix , suffix  }, candidate) {
    return candidate.length >= prefix.length + suffix.length && candidate.startsWith(prefix) && candidate.endsWith(suffix);
}
function findBestPatternMatch(values, getPattern, candidate) {
    let matchedValue;
    // use length of prefix as betterness criteria
    let longestMatchPrefixLength = -1;
    for (const v of values){
        const pattern = getPattern(v);
        if (isPatternMatch(pattern, candidate) && pattern.prefix.length > longestMatchPrefixLength) {
            longestMatchPrefixLength = pattern.prefix.length;
            matchedValue = v;
        }
    }
    return matchedValue;
}
function matchPatternOrExact(patternStrings, candidate) {
    const patterns = [];
    for (const patternString of patternStrings){
        if (!hasZeroOrOneAsteriskCharacter(patternString)) continue;
        const pattern = tryParsePattern(patternString);
        if (pattern) {
            patterns.push(pattern);
        } else if (patternString === candidate) {
            // pattern was matched as is - no need to search further
            return patternString;
        }
    }
    return findBestPatternMatch(patterns, (_)=>_
    , candidate);
}
function isString(text) {
    return typeof text === 'string';
}
function matchedText(pattern, candidate) {
    return candidate.substring(pattern.prefix.length, candidate.length - pattern.suffix.length);
}
function patternText({ prefix , suffix  }) {
    return `${prefix}*${suffix}`;
}
const NODE_MODULES_REGEX = /node_modules/;
class JsConfigPathsPlugin {
    constructor(paths, resolvedBaseUrl){
        this.paths = paths;
        this.resolvedBaseUrl = resolvedBaseUrl;
        log('tsconfig.json or jsconfig.json paths: %O', paths);
        log('resolved baseUrl: %s', resolvedBaseUrl);
    }
    apply(resolver) {
        const paths1 = this.paths;
        const pathsKeys = Object.keys(paths1);
        // If no aliases are added bail out
        if (pathsKeys.length === 0) {
            log('paths are empty, bailing out');
            return;
        }
        const baseDirectory = this.resolvedBaseUrl;
        const target = resolver.ensureHook('resolve');
        resolver.getHook('described-resolve').tapPromise('JsConfigPathsPlugin', async (request, resolveContext)=>{
            const moduleName = request.request;
            // Exclude node_modules from paths support (speeds up resolving)
            if (request.path.match(NODE_MODULES_REGEX)) {
                log('skipping request as it is inside node_modules %s', moduleName);
                return;
            }
            if (_path.default.posix.isAbsolute(moduleName) || process.platform === 'win32' && _path.default.win32.isAbsolute(moduleName)) {
                log('skipping request as it is an absolute path %s', moduleName);
                return;
            }
            if (pathIsRelative(moduleName)) {
                log('skipping request as it is a relative path %s', moduleName);
                return;
            }
            // log('starting to resolve request %s', moduleName)
            // If the module name does not match any of the patterns in `paths` we hand off resolving to webpack
            const matchedPattern = matchPatternOrExact(pathsKeys, moduleName);
            if (!matchedPattern) {
                log('moduleName did not match any paths pattern %s', moduleName);
                return;
            }
            const matchedStar = isString(matchedPattern) ? undefined : matchedText(matchedPattern, moduleName);
            const matchedPatternText = isString(matchedPattern) ? matchedPattern : patternText(matchedPattern);
            let triedPaths = [];
            for (const subst of paths1[matchedPatternText]){
                const curPath = matchedStar ? subst.replace('*', matchedStar) : subst;
                // Ensure .d.ts is not matched
                if (curPath.endsWith('.d.ts')) {
                    continue;
                }
                const candidate = _path.default.join(baseDirectory, curPath);
                const [err, result] = await new Promise((resolve)=>{
                    const obj = Object.assign({
                    }, request, {
                        request: candidate
                    });
                    resolver.doResolve(target, obj, `Aliased with tsconfig.json or jsconfig.json ${matchedPatternText} to ${candidate}`, resolveContext, (resolverErr, resolverResult)=>{
                        resolve([
                            resolverErr,
                            resolverResult
                        ]);
                    });
                });
                // There's multiple paths values possible, so we first have to iterate them all first before throwing an error
                if (err || result === undefined) {
                    triedPaths.push(candidate);
                    continue;
                }
                return result;
            }
        });
    }
}
exports.JsConfigPathsPlugin = JsConfigPathsPlugin;

//# sourceMappingURL=jsconfig-paths-plugin.js.map