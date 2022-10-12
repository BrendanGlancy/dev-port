import { TypeCheckResult } from './typescript/runTypeCheck';
export declare function verifyTypeScriptSetup(dir: string, pagesDir: string, typeCheckPreflight: boolean, imageImportsEnabled: boolean, cacheDir?: string): Promise<{
    result?: TypeCheckResult;
    version: string | null;
}>;
