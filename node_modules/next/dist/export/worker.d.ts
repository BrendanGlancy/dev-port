import type { ExportPageInput, ExportPageResult } from './types';
import '../server/node-polyfill-fetch';
import '../server/node-polyfill-web-streams';
import '../server/node-environment';
import '../lib/polyfill-promise-with-resolvers';
export default function exportPage(input: ExportPageInput): Promise<ExportPageResult | undefined>;
