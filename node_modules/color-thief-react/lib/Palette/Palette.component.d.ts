import * as React from 'react';
import { ColorFormats, ReducerState, ArrayRGB } from '../types';
declare function Palette<F extends ColorFormats, S extends ReducerState<F extends 'rgbArray' ? ArrayRGB[] : string[]>>({ src, colorCount, format, crossOrigin, quality, children }: PaletteProps<F, S>): JSX.Element;
export declare type PaletteProps<F extends ColorFormats, S extends ReducerState<F extends 'rgbArray' ? ArrayRGB[] : string[]>> = {
    /**
     * Count of colors of the palette
     */
    colorCount?: number;
    /**
     * Link of the image
     */
    src: string;
    /**
     * Format of the response.
     */
    format: F;
    /**
     * Tag cross-origin for image
     */
    crossOrigin?: string;
    /**
     * Quality determines how many pixels are skipped before the nex one is sampled.We rarely need to sample every single pixel in the image to get good results. The bigger the number, the faster a value will be returned. Read more in https://lokeshdhakar.com/projects/color-thief/
     */
    quality?: number;
    children: (state: S) => React.ReactNode;
};
export default Palette;
