import { ColorFormats, ReducerState, ArrayRGB } from '../types';
/**
 * React Hook to use get color from img url
 */
export default function useColor<F extends ColorFormats, S extends ReducerState<F extends 'rgbArray' ? ArrayRGB : string>>(imgSrc: string, format: F, options?: {
    crossOrigin?: string;
    quality?: number;
}): S;
