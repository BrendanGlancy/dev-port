import type { ColorFormats, ArrayRGB } from '../types';
/**
 * Transform a RGB Array to another color format
 */
export default function formatRGB<T extends ColorFormats>(arrayRGB: ArrayRGB, format: T): T extends 'rgbArray' ? ArrayRGB : string;
