import React, { useRef, useEffect, memo } from 'react';

async function type(node, ...args) {
    for (const arg of args) {
        switch (typeof arg) {
            case 'string':
                await edit(node, arg);
                break;
            case 'number':
                await wait(arg);
                break;
            case 'function':
                await arg(node, ...args);
                break;
            default:
                await arg;
        }
    }
}

async function edit(node, text) {
    const overlap = getOverlap(node.textContent, text);
    await perform(node, [...deleter(node.textContent, overlap), ...writer(text, overlap)]);
}

async function wait(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

async function perform(node, edits, speed = 60) {
    for (const op of editor(edits)) {
        op(node);
        await wait(speed + speed * (Math.random() - 0.5));
    }
}

function* editor(edits) {
    for (const edit of edits) {
        yield (node) => requestAnimationFrame(() => node.textContent = edit);
    }
}

function* writer([...text], startIndex = 0, endIndex = text.length) {
    while (startIndex < endIndex) {
        yield text.slice(0, ++startIndex).join('');
    }
}

function* deleter([...text], startIndex = 0, endIndex = text.length) {
    while (endIndex > startIndex) {
        yield text.slice(0, --endIndex).join('');
    }
}

function getOverlap(start, [...end]) {
    return [...start, NaN].findIndex((char, i) => end[i] !== char);
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".styles_typicalWrapper__1_Uvh::after {\n  content: \"|\";\n  animation: styles_blink__2CKyC 1s infinite step-start;\n}\n\n@keyframes styles_blink__2CKyC {\n  50% { opacity: 0; }\n}";
var styles = { "typicalWrapper": "styles_typicalWrapper__1_Uvh", "blink": "styles_blink__2CKyC" };
styleInject(css);

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Typical = function Typical(_ref) {
  var steps = _ref.steps,
      loop = _ref.loop,
      className = _ref.className,
      _ref$wrapper = _ref.wrapper,
      wrapper = _ref$wrapper === undefined ? "p" : _ref$wrapper;

  var typicalRef = useRef(null);
  var Component = wrapper;
  var classNames = [styles.typicalWrapper];

  if (className) {
    classNames.unshift(className);
  }

  useEffect(function () {
    if (loop === Infinity) {
      type.apply(undefined, [typicalRef.current].concat(toConsumableArray(steps), [type]));
    } else if (typeof loop === "number") {
      type.apply(undefined, [typicalRef.current].concat(toConsumableArray(Array(loop).fill(steps).flat())));
    } else {
      type.apply(undefined, [typicalRef.current].concat(toConsumableArray(steps)));
    }
  });

  return React.createElement(Component, { ref: typicalRef, className: classNames.join(' ') });
};

var index = memo(Typical);

export default index;
//# sourceMappingURL=index.es.js.map
