function recursiveAnimationFrame(frames, callback) {
  if (window && frames && Number.isInteger(frames) && frames > 0) {
    window.requestAnimationFrame(() => {
      recursiveAnimationFrame(frames - 1, callback);
    });
    return;
  }
  callback();
}

export function setCssEndEvent(
  element,
  type,
  { tolerance = 0, propertyName } = {}
) {
  return new Promise(resolve => {
    if (!element) {
      resolve(false);
      return;
    }
    let eventName = null;
    const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
    let run = 0;
    function end(event) {
      const target = event.srcElement || event.target;
      if (target === element) {
        if (run >= tolerance) {
          if (propertyName && propertyName !== event.propertyName) {
            return;
          }
          element.removeEventListener(eventName, end);
          resolve(event);
        }
        run += 1;
      }
    }
    if (element.style[`Webkit${capitalized}`] !== undefined) {
      eventName = `webkit${capitalized}End`;
    }
    if (element.style.OTransition !== undefined) {
      eventName = `o${type}End`;
    }
    if (element.style[type] !== undefined) {
      eventName = `${type}end`;
    }
    if (element.clearCssEndEvent) {
      element.clearCssEndEvent();
    }
    element.clearCssEndEvent = function() {
      element.removeEventListener(eventName, end);
    };
    element.addEventListener(eventName, end);
  });
}

export function beforeCssLayout(callback) {
  window && window.requestAnimationFrame(callback);
}

export function beforeNextCssLayout(callback) {
  window &&
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(callback);
    });
}

export function beforeFutureCssLayout(frames, callback) {
  recursiveAnimationFrame(frames + 1, callback);
}

export function onceNextCssLayout() {
  return new Promise(resolve => {
    beforeNextCssLayout(resolve);
  });
}

export function onceTransitionEnd(element, options = {}) {
  return new Promise(resolve => {
    setCssEndEvent(element, "transition", options).then(resolve);
  });
}

export function onceAnimationEnd(element, options = {}) {
  return new Promise(resolve => {
    setCssEndEvent(element, "animation", options).then(resolve);
  });
}
