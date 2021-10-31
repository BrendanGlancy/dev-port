# web-animation-club

[![Travis](https://img.shields.io/travis/rcaferati/web-animation-club/master.svg)](https://travis-ci.org/rcaferati/web-animation-club) ![NPM](https://img.shields.io/npm/v/web-animation-club.svg)

Tiny `~0.8kb` javascript library with cross-browser methods to handle CSS `ontransitionend` and `onanimationend` events. AKA css animation and transition callbacks.

## Quick usage
Quick usage example of the `onceTransitionEnd` wac method.
```javascript
wac.onceTransitionEnd(element).then(function(event) {
  // ... do something
});
```

## Live Demo
Access the demo at [https://webanimation.club](https://webanimation.club)

[<img width="600" alt="react-awesome-slider demo" src="https://github.com/rcaferati/web-animation-club/blob/master/demo/assets/wac-video.gif?raw=true">](https://webanimation.club)

## Installation

#### From the `dist` file
Just load directly in your `HTML` the `web-animation-club.min.js` javascript file located on the `dist` folder.
```html
... 
<script src="https://webanimation.club/library/0.1.2/web-animation-club.min.js"></script>
...
```

#### NPM Registry
From the `NPM registry` using npm or yarn just install the `web-animation-club` package.
```
npm install --save web-animation-club
```
or
```
yarn add --save web-animation-club
```

## Basic Usage
For all the following examples please consider the following HTML markup.
```html
<style>
  .animated {
    transition: transform 0.4s linear;
  }
  .move {
    transform: translateX(100px);
  }
</style>
<div class="container">
  <div class="box"></div>
</div>
```

#### HTML with ES5
```html
<script src="/path/to/web-animation-club.min.js"></script>
<script>
  var box = document.querySelector('.box');
  
  box.classList.add('animated');
  box.classList.add('move');
  
  onceTransitionEnd(box).then(function(event) {
    // ... do something
  });
</script>
```
#### Javascript ES6
```jsx
  import { onceTransitionEnd } from 'web-animation-club';

  const element = document.querySelector('.box');
  
  // here we're just simulating the addition of a class with some animation/transition
  element.classList.add('animated');
  element.classList.add('move');
  
  // if you are using the transition css property
  onceTransitionEnd(element).then((event) => {
    // ... do something
  });
```

## WAC methods

#### onceTransitionEnd(element, options)
- `element` <[HTML element]> html element on which the transition is happening
- `options` <[object]>
  - `tolerance` <[integer]> used in case of pseudo-element animations
  - `property` <[string]> animated property to check before calling the callback

#### onceAnimationEnd(element, options)
- `element` <[HTML element]> html element on which the transition is happening
- `options` <[object]>
  - `tolerance` <[integer]> used in case of pseudo-element animations
  - `property` <[string]> animated property to check before calling the callback
  
#### beforeFutureCssLayout(frames, callback)
- `frames` <[integer]> Number of frames to skip
- `callback` <[function]> function called after the skipped frames

#### beforeNextCssLayout(callback)
- `callback` <[function]> function called after the skipped frame

## Author
#### Rafael Caferati
+ Checkout my <a href="https://caferati.me" title="Full-Stack Web Developer, UI/UX Javascript Specialist" target="_blank">Full-Stack Web Developer Website</a>
+ Other open source projects @ <a title="Web Software Developer Code Laboratory" target="_blank" href="https://caferati.me/labs">Code Laboratory</a>
+ A scope of my work @ <a title="Web Software Developer Portfolio" target="_blank" href="https://caferati.me/portfolio">Web Portfolio</a>

## License

MIT. Copyright (c) 2018 Rafael Caferati.
