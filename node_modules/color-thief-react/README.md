# Color Thief (React)
🎨 A React component with hooks for Color Thief. Grab color palette from an image with javascript
Use the official Lokesh's [color-thief](https://github.com/lokesh/color-thief/).

[![npm (scoped)](https://img.shields.io/npm/v/color-thief-react.svg)](https://www.npmjs.com/package/color-thief-react)
![Build Status](https://github.com/jonyw4/color-thief-react/workflows/Test,%20build%20and%20deploy/badge.svg)
[![codecov](https://codecov.io/gh/jonyw4/color-thief-react/branch/master/graph/badge.svg)](https://codecov.io/gh/jonyw4/color-thief-react)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![GitHub](https://img.shields.io/github/license/jonyw4/color-thief-react)

### Do you like?
*Please, consider supporting my work as a lot of effort takes place to create this component! Thanks a lot.*

<a href="https://www.buymeacoffee.com/jonycelio" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-yellow.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>


### Demo
**See a real [demo in the Codesandbox](https://codesandbox.io/s/color-thief-react100-zh6f8)**

## Install
```
npm i -S color-thief-react
```

```
yarn add color-thief-react
```

## Basic Usage
```jsx
import Color from 'color-thief-react';
// In your render...
<Color src={IMAGE_URL}>
  {({ data, loading, error }) => (
    <div style={{ color: data }}>
      Text with the predominant color
    </div>
  )}
</Color>
```

## API
### Color

Return the predominant color of the image. You can use a React component or hook. Both have the same props.

`src`: **Required**. Link of the image

---

`format`: Format of the response. Can be `rgbString`, `rgbArray`, `hslString`, `hslArray`, `hex` or a CSS `keyword`. Default is `rgbString`

Color conversion is made possible by the [color-convert](https://www.npmjs.com/package/color-convert) package.

**Examples**

rgbString: `'rgb(89, 197, 182)'`
rgbArray: `[89, 197, 182]`
hslString: `'hsl(172, 48%, 56%)'`
hslArray: `[172, 48, 56]`
hex: `'#59c5b6'`
keyword: `'mediumaquamarine'`


**CSS Keywords**
`keyword`: Color keywords are case-insensitive identifiers that represent a specific color, such as `red`, `blue`, `black`, or `lightseagreen`. 

Keywords are matched to the closest color. See this page on [Web Colors](https://drafts.csswg.org/css-color/#named-colors) for a complete list of colors that can be returned with the `keyword` color format.  

---
`crossOrigin`: Tag cross-origin for image

---

`quality`: Quality determines how many pixels are skipped before the next one is sampled. We rarely need to sample every single pixel in the image to get good results. The bigger the number, the faster a value will be returned. Read more in https://lokeshdhakar.com/projects/color-thief/

### Usage
```jsx
import { useColor } from 'color-thief-react'

const { data, loading, error } = useColor(src, format, { crossOrigin, quality})

<div style={{ color: data }}>
  Text with the predominant color
</div>
```
```jsx
import Color from 'color-thief-react';
// In your render...
<Color src={IMAGE_URL} format="hex">
  {({ data, loading, error }) => (
    <div style={{ color: data }}>
      Text with the predominant color
    </div>
  )}
</Color>
```
### Palette
Return a palette of colors based on the predominance of colors on the image. You can use a React component or hook. Both have the same props.

`src`: **Required**. Link of the image

`colorCount`: Count of colors of the palette. Default is 2

`format`: Format of the response. See the `format` section in the [Color](#color) chapter for a detailed API.

`crossOrigin`: Tag cross-origin for image

`quality`: Default is `10`. Quality determines how many pixels are skipped before the next one is sampled. We rarely need to sample every single pixel in the image to get good results. The bigger the number, the faster a value will be returned. Read more in https://lokeshdhakar.com/projects/color-thief/

```jsx
import { Palette } from 'color-thief-react';
// In your render...
<Palette src={IMAGE_URL} colorCount={2}>
  {({ data, loading, error }) => (
    <div style={{ color: data[0], backgroundColor: data[1] }}>
      Text with the predominant color
    </div>
  )}
</Palette>
```

```jsx
import { usePalette } from 'color-thief-react'

const { data, loading, error } = usePalette(src, colorCount, format, { crossOrigin, quality})

<div style={{ color: data[0], backgroundPalette: data[1] }}>
  Text with the predominant color
</div>
```
