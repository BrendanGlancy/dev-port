import { ColorFormats, ArrayRGB } from '../types';
/**
 * Get a list of colors from img url
 */
export default function getColorsPaletteFromImgUrl<T extends ColorFormats>(imgUrl: string, colorCount: number | undefined, format: T, crossOrigin?: string | null, quality?: number): Promise<(T extends 'rgbArray' ? ArrayRGB : string)[]>;
