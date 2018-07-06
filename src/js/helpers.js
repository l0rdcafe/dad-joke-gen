function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

function qsa(selector, scope) {
  return (scope || document).querySelectorAll(selector);
}

function $on(target, type, cb, useCapture) {
  target.addEventListener(type, cb, !!useCapture);
}

function $parent(element, tagName) {
  if (!element.parentNode) {
    return undefined;
  }

  if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
    return element.parentNode;
  }
  return $parent(element.parentNode, tagName);
}

export { qs, $on, $parent, qsa };
