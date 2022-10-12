import { ColorFormats, ReducerState, ArrayRGB } from '../types';
/**
 * React Hook to get palette color from img url
 */
export default function usePalette<F extends ColorFormats, S extends ReducerState<F extends 'rgbArray' ? ArrayRGB[] : string[]>>(imgSrc: string, colorCount: number | undefined, format: F, options?: {
    crossOrigin?: string;
    quality?: number;
}): S;
