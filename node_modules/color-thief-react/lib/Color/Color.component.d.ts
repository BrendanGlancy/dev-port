import * as React from 'react';
import { ColorFormats, ReducerState, ArrayRGB } from '../types';
declare function Color<F extends ColorFormats, S extends ReducerState<F extends 'rgbArray' ? ArrayRGB : string>>({ src, format, crossOrigin, quality, children }: ColorProps<F, S>): JSX.Element;
export declare type ColorProps<F extends ColorFormats, S extends ReducerState<F extends 'rgbArray' ? ArrayRGB : string>> = {
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
export default Color;
