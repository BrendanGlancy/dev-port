import { ColorFormats, ArrayRGB } from '../types';
export default function getPredominantColorFromImgURL<T extends ColorFormats>(imgSrc: string, format: T, crossOrigin?: string | null, quality?: number): Promise<T extends 'rgbArray' ? ArrayRGB : string>;
