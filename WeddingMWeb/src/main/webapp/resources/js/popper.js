/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.12.9
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            typeof define === 'function' && define.amd ? define(factory) :
            (global.Popper = factory());
}(this, (function () {
    'use strict';

    var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
    var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
    var timeoutDuration = 0;
    for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
        if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
            timeoutDuration = 1;
            break;
        }
    }

    function microtaskDebounce(fn) {
        var called = false;
        return function () {
            if (called) {
                return;
            }
            called = true;
            window.Promise.resolve().then(function () {
                called = false;
                fn();
            });
        };
    }

    function taskDebounce(fn) {
        var scheduled = false;
        return function () {
            if (!scheduled) {
                scheduled = true;
                setTimeout(function () {
                    scheduled = false;
                    fn();
                }, timeoutDuration);
            }
        };
    }

    var supportsMicroTasks = isBrowser && window.Promise;

    /**
     * Create a debounced version of a method, that's asynchronously deferred
     * but called in the minimum time possible.
     *
     * @method
     * @memberof Popper.Utils
     * @argument {Function} fn
     * @returns {Function}
     */
    var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

    /**
     * Check if the given variable is a function
     * @method
     * @memberof Popper.Utils
     * @argument {Any} functionToCheck - variable to check
     * @returns {Boolean} answer to: is a function?
     */
    function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    /**
     * Get CSS computed property of the given element
     * @method
     * @memberof Popper.Utils
     * @argument {Eement} element
     * @argument {String} property
     */
    function getStyleComputedProperty(element, property) {
        if (element.nodeType !== 1) {
            return [];
        }
        // NOTE: 1 DOM access here
        var css = getComputedStyle(element, null);
        return property ? css[property] : css;
    }

    /**
     * Returns the parentNode or the host of the element
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element
     * @returns {Element} parent
     */
    function getParentNode(element) {
        if (element.nodeName === 'HTML') {
            return element;
        }
        return element.parentNode || element.host;
    }

    /**
     * Returns the scrolling parent of the given element
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element
     * @returns {Element} scroll parent
     */
    function getScrollParent(element) {
        // Return body, `getScroll` will take care to get the correct `scrollTop` from it
        if (!element) {
            return document.body;
        }

        switch (element.nodeName) {
            case 'HTML':
            case 'BODY':
                return element.ownerDocument.body;
            case '#document':
                return element.body;
        }

        // Firefox want us to check `-x` and `-y` variations as well

        var _getStyleComputedProp = getStyleComputedProperty(element),
                overflow = _getStyleComputedProp.overflow,
                overflowX = _getStyleComputedProp.overflowX,
                overflowY = _getStyleComputedProp.overflowY;

        if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
            return element;
        }

        return getScrollParent(getParentNode(element));
    }

    /**
     * Returns the offset parent of the given element
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element
     * @returns {Element} offset parent
     */
    function getOffsetParent(element) {
        // NOTE: 1 DOM access here
        var offsetParent = element && element.offsetParent;
        var nodeName = offsetParent && offsetParent.nodeName;

        if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
            if (element) {
                return element.ownerDocument.documentElement;
            }

            return document.documentElement;
        }

        // .offsetParent will return the closest TD or TABLE in case
        // no offsetParent is present, I hate this job...
        if (['TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
            return getOffsetParent(offsetParent);
        }

        return offsetParent;
    }

    function isOffsetContainer(element) {
        var nodeName = element.nodeName;

        if (nodeName === 'BODY') {
            return false;
        }
        return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
    }

    /**
     * Finds the root node (document, shadowDOM root) of the given element
     * @method
     * @memberof Popper.Utils
     * @argument {Element} node
     * @returns {Element} root node
     */
    function getRoot(node) {
        if (node.parentNode !== null) {
            return getRoot(node.parentNode);
        }

        return node;
    }

    /**
     * Finds the offset parent common to the two provided nodes
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element1
     * @argument {Element} element2
     * @returns {Element} common offset parent
     */
    function findCommonOffsetParent(element1, element2) {
        // This check is needed to avoid errors in case one of the elements isn't defined for any reason
        if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
            return document.documentElement;
        }

        // Here we make sure to give as "start" the element that comes first in the DOM
        var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
        var start = order ? element1 : element2;
        var end = order ? element2 : element1;

        // Get common ancestor container
        var range = document.createRange();
        range.setStart(start, 0);
        range.setEnd(end, 0);
        var commonAncestorContainer = range.commonAncestorContainer;

        // Both nodes are inside #document

        if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
            if (isOffsetContainer(commonAncestorContainer)) {
                return commonAncestorContainer;
            }

            return getOffsetParent(commonAncestorContainer);
        }

        // one of the nodes is inside shadowDOM, find which one
        var element1root = getRoot(element1);
        if (element1root.host) {
            return findCommonOffsetParent(element1root.host, element2);
        } else {
            return findCommonOffsetParent(element1, getRoot(element2).host);
        }
    }

    /**
     * Gets the scroll value of the given element in the given side (top and left)
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element
     * @argument {String} side `top` or `left`
     * @returns {number} amount of scrolled pixels
     */
    function getScroll(element) {
        var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

        var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
        var nodeName = element.nodeName;

        if (nodeName === 'BODY' || nodeName === 'HTML') {
            var html = element.ownerDocument.documentElement;
            var scrollingElement = element.ownerDocument.scrollingElement || html;
            return scrollingElement[upperSide];
        }

        return element[upperSide];
    }

    /*
     * Sum or subtract the element scroll values (left and top) from a given rect object
     * @method
     * @memberof Popper.Utils
     * @param {Object} rect - Rect object you want to change
     * @param {HTMLElement} element - The element from the function reads the scroll values
     * @param {Boolean} subtract - set to true if you want to subtract the scroll values
     * @return {Object} rect - The modifier rect object
     */
    function includeScroll(rect, element) {
        var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var scrollTop = getScroll(element, 'top');
        var scrollLeft = getScroll(element, 'left');
        var modifier = subtract ? -1 : 1;
        rect.top += scrollTop * modifier;
        rect.bottom += scrollTop * modifier;
        rect.left += scrollLeft * modifier;
        rect.right += scrollLeft * modifier;
        return rect;
    }

    /*
     * Helper to detect borders of a given element
     * @method
     * @memberof Popper.Utils
     * @param {CSSStyleDeclaration} styles
     * Result of `getStyleComputedProperty` on the given element
     * @param {String} axis - `x` or `y`
     * @return {number} borders - The borders size of the given axis
     */

    function getBordersSize(styles, axis) {
        var sideA = axis === 'x' ? 'Left' : 'Top';
        var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

        return parseFloat(styles['border' + sideA + 'Width'], 10) + parseFloat(styles['border' + sideB + 'Width'], 10);
    }

    /**
     * Tells if you are running Internet Explorer 10
     * @method
     * @memberof Popper.Utils
     * @returns {Boolean} isIE10
     */
    var isIE10 = undefined;

    var isIE10$1 = function () {
        if (isIE10 === undefined) {
            isIE10 = navigator.appVersion.indexOf('MSIE 10') !== -1;
        }
        return isIE10;
    };

    function getSize(axis, body, html, computedStyle) {
        return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE10$1() ? html['offset' + axis] + computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')] + computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')] : 0);
    }

    function getWindowSizes() {
        var body = document.body;
        var html = document.documentElement;
        var computedStyle = isIE10$1() && getComputedStyle(html);

        return {
            height: getSize('Height', body, html, computedStyle),
            width: getSize('Width', body, html, computedStyle)
        };
    }

    var classCallCheck = function (instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    };

    var createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                    descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
                defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();





    var defineProperty = function (obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }

        return obj;
    };

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    /**
     * Given element offsets, generate an output similar to getBoundingClientRect
     * @method
     * @memberof Popper.Utils
     * @argument {Object} offsets
     * @returns {Object} ClientRect like output
     */
    function getClientRect(offsets) {
        return _extends({}, offsets, {
            right: offsets.left + offsets.width,
            bottom: offsets.top + offsets.height
        });
    }

    /**
     * Get bounding client rect of given element
     * @method
     * @memberof Popper.Utils
     * @param {HTMLElement} element
     * @return {Object} client rect
     */
    function getBoundingClientRect(element) {
        var rect = {};

        // IE10 10 FIX: Please, don't ask, the element isn't
        // considered in DOM in some circumstances...
        // This isn't reproducible in IE10 compatibility mode of IE11
        if (isIE10$1()) {
            try {
                rect = element.getBoundingClientRect();
                var scrollTop = getScroll(element, 'top');
                var scrollLeft = getScroll(element, 'left');
                rect.top += scrollTop;
                rect.left += scrollLeft;
                rect.bottom += scrollTop;
                rect.right += scrollLeft;
            } catch (err) {
            }
        } else {
            rect = element.getBoundingClientRect();
        }

        var result = {
            left: rect.left,
            top: rect.top,
            width: rect.right - rect.left,
            height: rect.bottom - rect.top
        };

        // subtract scrollbar size from sizes
        var sizes = element.nodeName === 'HTML' ? getWindowSizes() : {};
        var width = sizes.width || element.clientWidth || result.right - result.left;
        var height = sizes.height || element.clientHeight || result.bottom - result.top;

        var horizScrollbar = element.offsetWidth - width;
        var vertScrollbar = element.offsetHeight - height;

        // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
        // we make this check conditional for performance reasons
        if (horizScrollbar || vertScrollbar) {
            var styles = getStyleComputedProperty(element);
            horizScrollbar -= getBordersSize(styles, 'x');
            vertScrollbar -= getBordersSize(styles, 'y');

            result.width -= horizScrollbar;
            result.height -= vertScrollbar;
        }

        return getClientRect(result);
    }

    function getOffsetRectRelativeToArbitraryNode(children, parent) {
        var isIE10 = isIE10$1();
        var isHTML = parent.nodeName === 'HTML';
        var childrenRect = getBoundingClientRect(children);
        var parentRect = getBoundingClientRect(parent);
        var scrollParent = getScrollParent(children);

        var styles = getStyleComputedProperty(parent);
        var borderTopWidth = parseFloat(styles.borderTopWidth, 10);
        var borderLeftWidth = parseFloat(styles.borderLeftWidth, 10);

        var offsets = getClientRect({
            top: childrenRect.top - parentRect.top - borderTopWidth,
            left: childrenRect.left - parentRect.left - borderLeftWidth,
            width: childrenRect.width,
            height: childrenRect.height
        });
        offsets.marginTop = 0;
        offsets.marginLeft = 0;

        // Subtract margins of documentElement in case it's being used as parent
        // we do this only on HTML because it's the only element that behaves
        // differently when margins are applied to it. The margins are included in
        // the box of the documentElement, in the other cases not.
        if (!isIE10 && isHTML) {
            var marginTop = parseFloat(styles.marginTop, 10);
            var marginLeft = parseFloat(styles.marginLeft, 10);

            offsets.top -= borderTopWidth - marginTop;
            offsets.bottom -= borderTopWidth - marginTop;
            offsets.left -= borderLeftWidth - marginLeft;
            offsets.right -= borderLeftWidth - marginLeft;

            // Attach marginTop and marginLeft because in some circumstances we may need them
            offsets.marginTop = marginTop;
            offsets.marginLeft = marginLeft;
        }

        if (isIE10 ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
            offsets = includeScroll(offsets, parent);
        }

        return offsets;
    }

    function getViewportOffsetRectRelativeToArtbitraryNode(element) {
        var html = element.ownerDocument.documentElement;
        var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
        var width = Math.max(html.clientWidth, window.innerWidth || 0);
        var height = Math.max(html.clientHeight, window.innerHeight || 0);

        var scrollTop = getScroll(html);
        var scrollLeft = getScroll(html, 'left');

        var offset = {
            top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
            left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
            width: width,
            height: height
        };

        return getClientRect(offset);
    }

    /**
     * Check if the given element is fixed or is inside a fixed parent
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element
     * @argument {Element} customContainer
     * @returns {Boolean} answer to "isFixed?"
     */
    function isFixed(element) {
        var nodeName = element.nodeName;
        if (nodeName === 'BODY' || nodeName === 'HTML') {
            return false;
        }
        if (getStyleComputedProperty(element, 'position') === 'fixed') {
            return true;
        }
        return isFixed(getParentNode(element));
    }

    /**
     * Computed the boundaries limits and return them
     * @method
     * @memberof Popper.Utils
     * @param {HTMLElement} popper
     * @param {HTMLElement} reference
     * @param {number} padding
     * @param {HTMLElement} boundariesElement - Element used to define the boundaries
     * @returns {Object} Coordinates of the boundaries
     */
    function getBoundaries(popper, reference, padding, boundariesElement) {
        // NOTE: 1 DOM access here
        var boundaries = {top: 0, left: 0};
        var offsetParent = findCommonOffsetParent(popper, reference);

        // Handle viewport case
        if (boundariesElement === 'viewport') {
            boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent);
        } else {
            // Handle other cases based on DOM element used as boundaries
            var boundariesNode = void 0;
            if (boundariesElement === 'scrollParent') {
                boundariesNode = getScrollParent(getParentNode(reference));
                if (boundariesNode.nodeName === 'BODY') {
                    boundariesNode = popper.ownerDocument.documentElement;
                }
            } else if (boundariesElement === 'window') {
                boundariesNode = popper.ownerDocument.documentElement;
            } else {
                boundariesNode = boundariesElement;
            }

            var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent);

            // In case of HTML, we need a different computation
            if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
                var _getWindowSizes = getWindowSizes(),
                        height = _getWindowSizes.height,
                        width = _getWindowSizes.width;

                boundaries.top += offsets.top - offsets.marginTop;
                boundaries.bottom = height + offsets.top;
                boundaries.left += offsets.left - offsets.marginLeft;
                boundaries.right = width + offsets.left;
            } else {
                // for all the other DOM elements, this one is good
                boundaries = offsets;
            }
        }

        // Add paddings
        boundaries.left += padding;
        boundaries.top += padding;
        boundaries.right -= padding;
        boundaries.bottom -= padding;

        return boundaries;
    }

    function getArea(_ref) {
        var width = _ref.width,
                height = _ref.height;

        return width * height;
    }

    /**
     * Utility used to transform the `auto` placement to the placement with more
     * available space.
     * @method
     * @memberof Popper.Utils
     * @argument {Object} data - The data object generated by update method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
        var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

        if (placement.indexOf('auto') === -1) {
            return placement;
        }

        var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

        var rects = {
            top: {
                width: boundaries.width,
                height: refRect.top - boundaries.top
            },
            right: {
                width: boundaries.right - refRect.right,
                height: boundaries.height
            },
            bottom: {
                width: boundaries.width,
                height: boundaries.bottom - refRect.bottom
            },
            left: {
                width: refRect.left - boundaries.left,
                height: boundaries.height
            }
        };

        var sortedAreas = Object.keys(rects).map(function (key) {
            return _extends({
                key: key
            }, rects[key], {
                area: getArea(rects[key])
            });
        }).sort(function (a, b) {
            return b.area - a.area;
        });

        var filteredAreas = sortedAreas.filter(function (_ref2) {
            var width = _ref2.width,
                    height = _ref2.height;
            return width >= popper.clientWidth && height >= popper.clientHeight;
        });

        var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

        var variation = placement.split('-')[1];

        return computedPlacement + (variation ? '-' + variation : '');
    }

    /**
     * Get offsets to the reference element
     * @method
     * @memberof Popper.Utils
     * @param {Object} state
     * @param {Element} popper - the popper element
     * @param {Element} reference - the reference element (the popper will be relative to this)
     * @returns {Object} An object containing the offsets which will be applied to the popper
     */
    function getReferenceOffsets(state, popper, reference) {
        var commonOffsetParent = findCommonOffsetParent(popper, reference);
        return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent);
    }

    /**
     * Get the outer sizes of the given element (offset size + margins)
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element
     * @returns {Object} object containing width and height properties
     */
    function getOuterSizes(element) {
        var styles = getComputedStyle(element);
        var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
        var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
        var result = {
            width: element.offsetWidth + y,
            height: element.offsetHeight + x
        };
        return result;
    }

    /**
     * Get the opposite placement of the given one
     * @method
     * @memberof Popper.Utils
     * @argument {String} placement
     * @returns {String} flipped placement
     */
    function getOppositePlacement(placement) {
        var hash = {left: 'right', right: 'left', bottom: 'top', top: 'bottom'};
        return placement.replace(/left|right|bottom|top/g, function (matched) {
            return hash[matched];
        });
    }

    /**
     * Get offsets to the popper
     * @method
     * @memberof Popper.Utils
     * @param {Object} position - CSS position the Popper will get applied
     * @param {HTMLElement} popper - the popper element
     * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
     * @param {String} placement - one of the valid placement options
     * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
     */
    function getPopperOffsets(popper, referenceOffsets, placement) {
        placement = placement.split('-')[0];

        // Get popper node sizes
        var popperRect = getOuterSizes(popper);

        // Add position, width and height to our offsets object
        var popperOffsets = {
            width: popperRect.width,
            height: popperRect.height
        };

        // depending by the popper placement we have to compute its offsets slightly differently
        var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
        var mainSide = isHoriz ? 'top' : 'left';
        var secondarySide = isHoriz ? 'left' : 'top';
        var measurement = isHoriz ? 'height' : 'width';
        var secondaryMeasurement = !isHoriz ? 'height' : 'width';

        popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
        if (placement === secondarySide) {
            popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
        } else {
            popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
        }

        return popperOffsets;
    }

    /**
     * Mimics the `find` method of Array
     * @method
     * @memberof Popper.Utils
     * @argument {Array} arr
     * @argument prop
     * @argument value
     * @returns index or -1
     */
    function find(arr, check) {
        // use native find if supported
        if (Array.prototype.find) {
            return arr.find(check);
        }

        // use `filter` to obtain the same behavior of `find`
        return arr.filter(check)[0];
    }

    /**
     * Return the index of the matching object
     * @method
     * @memberof Popper.Utils
     * @argument {Array} arr
     * @argument prop
     * @argument value
     * @returns index or -1
     */
    function findIndex(arr, prop, value) {
        // use native findIndex if supported
        if (Array.prototype.findIndex) {
            return arr.findIndex(function (cur) {
                return cur[prop] === value;
            });
        }

        // use `find` + `indexOf` if `findIndex` isn't supported
        var match = find(arr, function (obj) {
            return obj[prop] === value;
        });
        return arr.indexOf(match);
    }

    /**
     * Loop trough the list of modifiers and run them in order,
     * each of them will then edit the data object.
     * @method
     * @memberof Popper.Utils
     * @param {dataObject} data
     * @param {Array} modifiers
     * @param {String} ends - Optional modifier name used as stopper
     * @returns {dataObject}
     */
    function runModifiers(modifiers, data, ends) {
        var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

        modifiersToRun.forEach(function (modifier) {
            if (modifier['function']) {
                // eslint-disable-line dot-notation
                console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
            }
            var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
            if (modifier.enabled && isFunction(fn)) {
                // Add properties to offsets to make them a complete clientRect object
                // we do this before each modifier to make sure the previous one doesn't
                // mess with these values
                data.offsets.popper = getClientRect(data.offsets.popper);
                data.offsets.reference = getClientRect(data.offsets.reference);

                data = fn(data, modifier);
            }
        });

        return data;
    }

    /**
     * Updates the position of the popper, computing the new offsets and applying
     * the new style.<br />
     * Prefer `scheduleUpdate` over `update` because of performance reasons.
     * @method
     * @memberof Popper
     */
    function update() {
        // if popper is destroyed, don't perform any further update
        if (this.state.isDestroyed) {
            return;
        }

        var data = {
            instance: this,
            styles: {},
            arrowStyles: {},
            attributes: {},
            flipped: false,
            offsets: {}
        };

        // compute reference element offsets
        data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference);

        // compute auto placement, store placement inside the data object,
        // modifiers will be able to edit `placement` if needed
        // and refer to originalPlacement to know the original value
        data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

        // store the computed placement inside `originalPlacement`
        data.originalPlacement = data.placement;

        // compute the popper offsets
        data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);
        data.offsets.popper.position = 'absolute';

        // run the modifiers
        data = runModifiers(this.modifiers, data);

        // the first `update` will call `onCreate` callback
        // the other ones will call `onUpdate` callback
        if (!this.state.isCreated) {
            this.state.isCreated = true;
            this.options.onCreate(data);
        } else {
            this.options.onUpdate(data);
        }
    }

    /**
     * Helper used to know if the given modifier is enabled.
     * @method
     * @memberof Popper.Utils
     * @returns {Boolean}
     */
    function isModifierEnabled(modifiers, modifierName) {
        return modifiers.some(function (_ref) {
            var name = _ref.name,
                    enabled = _ref.enabled;
            return enabled && name === modifierName;
        });
    }

    /**
     * Get the prefixed supported property name
     * @method
     * @memberof Popper.Utils
     * @argument {String} property (camelCase)
     * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
     */
    function getSupportedPropertyName(property) {
        var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
        var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

        for (var i = 0; i < prefixes.length - 1; i++) {
            var prefix = prefixes[i];
            var toCheck = prefix ? '' + prefix + upperProp : property;
            if (typeof document.body.style[toCheck] !== 'undefined') {
                return toCheck;
            }
        }
        return null;
    }

    /**
     * Destroy the popper
     * @method
     * @memberof Popper
     */
    function destroy() {
        this.state.isDestroyed = true;

        // touch DOM only if `applyStyle` modifier is enabled
        if (isModifierEnabled(this.modifiers, 'applyStyle')) {
            this.popper.removeAttribute('x-placement');
            this.popper.style.left = '';
            this.popper.style.position = '';
            this.popper.style.top = '';
            this.popper.style[getSupportedPropertyName('transform')] = '';
        }

        this.disableEventListeners();

        // remove the popper if user explicity asked for the deletion on destroy
        // do not use `remove` because IE11 doesn't support it
        if (this.options.removeOnDestroy) {
            this.popper.parentNode.removeChild(this.popper);
        }
        return this;
    }

    /**
     * Get the window associated with the element
     * @argument {Element} element
     * @returns {Window}
     */
    function getWindow(element) {
        var ownerDocument = element.ownerDocument;
        return ownerDocument ? ownerDocument.defaultView : window;
    }

    function attachToScrollParents(scrollParent, event, callback, scrollParents) {
        var isBody = scrollParent.nodeName === 'BODY';
        var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
        target.addEventListener(event, callback, {passive: true});

        if (!isBody) {
            attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
        }
        scrollParents.push(target);
    }

    /**
     * Setup needed event listeners used to update the popper position
     * @method
     * @memberof Popper.Utils
     * @private
     */
    function setupEventListeners(reference, options, state, updateBound) {
        // Resize event listener on window
        state.updateBound = updateBound;
        getWindow(reference).addEventListener('resize', state.updateBound, {passive: true});

        // Scroll event listener on scroll parents
        var scrollElement = getScrollParent(reference);
        attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
        state.scrollElement = scrollElement;
        state.eventsEnabled = true;

        return state;
    }

    /**
     * It will add resize/scroll events and start recalculating
     * position of the popper element when they are triggered.
     * @method
     * @memberof Popper
     */
    function enableEventListeners() {
        if (!this.state.eventsEnabled) {
            this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
        }
    }

    /**
     * Remove event listeners used to update the popper position
     * @method
     * @memberof Popper.Utils
     * @private
     */
    function removeEventListeners(reference, state) {
        // Remove resize event listener on window
        getWindow(reference).removeEventListener('resize', state.updateBound);

        // Remove scroll event listener on scroll parents
        state.scrollParents.forEach(function (target) {
            target.removeEventListener('scroll', state.updateBound);
        });

        // Reset state
        state.updateBound = null;
        state.scrollParents = [];
        state.scrollElement = null;
        state.eventsEnabled = false;
        return state;
    }

    /**
     * It will remove resize/scroll events and won't recalculate popper position
     * when they are triggered. It also won't trigger onUpdate callback anymore,
     * unless you call `update` method manually.
     * @method
     * @memberof Popper
     */
    function disableEventListeners() {
        if (this.state.eventsEnabled) {
            cancelAnimationFrame(this.scheduleUpdate);
            this.state = removeEventListeners(this.reference, this.state);
        }
    }

    /**
     * Tells if a given input is a number
     * @method
     * @memberof Popper.Utils
     * @param {*} input to check
     * @return {Boolean}
     */
    function isNumeric(n) {
        return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
     * Set the style to the given popper
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element - Element to apply the style to
     * @argument {Object} styles
     * Object with a list of properties and values which will be applied to the element
     */
    function setStyles(element, styles) {
        Object.keys(styles).forEach(function (prop) {
            var unit = '';
            // add unit if the value is numeric and is one of the following
            if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
                unit = 'px';
            }
            element.style[prop] = styles[prop] + unit;
        });
    }

    /**
     * Set the attributes to the given popper
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element - Element to apply the attributes to
     * @argument {Object} styles
     * Object with a list of properties and values which will be applied to the element
     */
    function setAttributes(element, attributes) {
        Object.keys(attributes).forEach(function (prop) {
            var value = attributes[prop];
            if (value !== false) {
                element.setAttribute(prop, attributes[prop]);
            } else {
                element.removeAttribute(prop);
            }
        });
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by `update` method
     * @argument {Object} data.styles - List of style properties - values to apply to popper element
     * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The same data object
     */
    function applyStyle(data) {
        // any property present in `data.styles` will be applied to the popper,
        // in this way we can make the 3rd party modifiers add custom styles to it
        // Be aware, modifiers could override the properties defined in the previous
        // lines of this modifier!
        setStyles(data.instance.popper, data.styles);

        // any property present in `data.attributes` will be applied to the popper,
        // they will be set as HTML attributes of the element
        setAttributes(data.instance.popper, data.attributes);

        // if arrowElement is defined and arrowStyles has some properties
        if (data.arrowElement && Object.keys(data.arrowStyles).length) {
            setStyles(data.arrowElement, data.arrowStyles);
        }

        return data;
    }

    /**
     * Set the x-placement attribute before everything else because it could be used
     * to add margins to the popper margins needs to be calculated to get the
     * correct popper offsets.
     * @method
     * @memberof Popper.modifiers
     * @param {HTMLElement} reference - The reference element used to position the popper
     * @param {HTMLElement} popper - The HTML element used as popper.
     * @param {Object} options - Popper.js options
     */
    function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
        // compute reference element offsets
        var referenceOffsets = getReferenceOffsets(state, popper, reference);

        // compute auto placement, store placement inside the data object,
        // modifiers will be able to edit `placement` if needed
        // and refer to originalPlacement to know the original value
        var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

        popper.setAttribute('x-placement', placement);

        // Apply `position` to popper before anything else because
        // without the position applied we can't guarantee correct computations
        setStyles(popper, {position: 'absolute'});

        return options;
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by `update` method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function computeStyle(data, options) {
        var x = options.x,
                y = options.y;
        var popper = data.offsets.popper;

        // Remove this legacy support in Popper.js v2

        var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
            return modifier.name === 'applyStyle';
        }).gpuAcceleration;
        if (legacyGpuAccelerationOption !== undefined) {
            console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
        }
        var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

        var offsetParent = getOffsetParent(data.instance.popper);
        var offsetParentRect = getBoundingClientRect(offsetParent);

        // Styles
        var styles = {
            position: popper.position
        };

        // floor sides to avoid blurry text
        var offsets = {
            left: Math.floor(popper.left),
            top: Math.floor(popper.top),
            bottom: Math.floor(popper.bottom),
            right: Math.floor(popper.right)
        };

        var sideA = x === 'bottom' ? 'top' : 'bottom';
        var sideB = y === 'right' ? 'left' : 'right';

        // if gpuAcceleration is set to `true` and transform is supported,
        //  we use `translate3d` to apply the position to the popper we
        // automatically use the supported prefixed version if needed
        var prefixedProperty = getSupportedPropertyName('transform');

        // now, let's make a step back and look at this code closely (wtf?)
        // If the content of the popper grows once it's been positioned, it
        // may happen that the popper gets misplaced because of the new content
        // overflowing its reference element
        // To avoid this problem, we provide two options (x and y), which allow
        // the consumer to define the offset origin.
        // If we position a popper on top of a reference element, we can set
        // `x` to `top` to make the popper grow towards its top instead of
        // its bottom.
        var left = void 0,
                top = void 0;
        if (sideA === 'bottom') {
            top = -offsetParentRect.height + offsets.bottom;
        } else {
            top = offsets.top;
        }
        if (sideB === 'right') {
            left = -offsetParentRect.width + offsets.right;
        } else {
            left = offsets.left;
        }
        if (gpuAcceleration && prefixedProperty) {
            styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
            styles[sideA] = 0;
            styles[sideB] = 0;
            styles.willChange = 'transform';
        } else {
            // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
            var invertTop = sideA === 'bottom' ? -1 : 1;
            var invertLeft = sideB === 'right' ? -1 : 1;
            styles[sideA] = top * invertTop;
            styles[sideB] = left * invertLeft;
            styles.willChange = sideA + ', ' + sideB;
        }

        // Attributes
        var attributes = {
            'x-placement': data.placement
        };

        // Update `data` attributes, styles and arrowStyles
        data.attributes = _extends({}, attributes, data.attributes);
        data.styles = _extends({}, styles, data.styles);
        data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

        return data;
    }

    /**
     * Helper used to know if the given modifier depends from another one.<br />
     * It checks if the needed modifier is listed and enabled.
     * @method
     * @memberof Popper.Utils
     * @param {Array} modifiers - list of modifiers
     * @param {String} requestingName - name of requesting modifier
     * @param {String} requestedName - name of requested modifier
     * @returns {Boolean}
     */
    function isModifierRequired(modifiers, requestingName, requestedName) {
        var requesting = find(modifiers, function (_ref) {
            var name = _ref.name;
            return name === requestingName;
        });

        var isRequired = !!requesting && modifiers.some(function (modifier) {
            return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
        });

        if (!isRequired) {
            var _requesting = '`' + requestingName + '`';
            var requested = '`' + requestedName + '`';
            console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
        }
        return isRequired;
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by update method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function arrow(data, options) {
        var _data$offsets$arrow;

        // arrow depends on keepTogether in order to work
        if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
            return data;
        }

        var arrowElement = options.element;

        // if arrowElement is a string, suppose it's a CSS selector
        if (typeof arrowElement === 'string') {
            arrowElement = data.instance.popper.querySelector(arrowElement);

            // if arrowElement is not found, don't run the modifier
            if (!arrowElement) {
                return data;
            }
        } else {
            // if the arrowElement isn't a query selector we must check that the
            // provided DOM node is child of its popper node
            if (!data.instance.popper.contains(arrowElement)) {
                console.warn('WARNING: `arrow.element` must be child of its popper element!');
                return data;
            }
        }

        var placement = data.placement.split('-')[0];
        var _data$offsets = data.offsets,
                popper = _data$offsets.popper,
                reference = _data$offsets.reference;

        var isVertical = ['left', 'right'].indexOf(placement) !== -1;

        var len = isVertical ? 'height' : 'width';
        var sideCapitalized = isVertical ? 'Top' : 'Left';
        var side = sideCapitalized.toLowerCase();
        var altSide = isVertical ? 'left' : 'top';
        var opSide = isVertical ? 'bottom' : 'right';
        var arrowElementSize = getOuterSizes(arrowElement)[len];

        //
        // extends keepTogether behavior making sure the popper and its
        // reference have enough pixels in conjuction
        //

        // top/left side
        if (reference[opSide] - arrowElementSize < popper[side]) {
            data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
        }
        // bottom/right side
        if (reference[side] + arrowElementSize > popper[opSide]) {
            data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
        }
        data.offsets.popper = getClientRect(data.offsets.popper);

        // compute center of the popper
        var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

        // Compute the sideValue using the updated popper offsets
        // take popper margin in account because we don't have this info available
        var css = getStyleComputedProperty(data.instance.popper);
        var popperMarginSide = parseFloat(css['margin' + sideCapitalized], 10);
        var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width'], 10);
        var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

        // prevent arrowElement from being placed not contiguously to its popper
        sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

        data.arrowElement = arrowElement;
        data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

        return data;
    }

    /**
     * Get the opposite placement variation of the given one
     * @method
     * @memberof Popper.Utils
     * @argument {String} placement variation
     * @returns {String} flipped placement variation
     */
    function getOppositeVariation(variation) {
        if (variation === 'end') {
            return 'start';
        } else if (variation === 'start') {
            return 'end';
        }
        return variation;
    }

    /**
     * List of accepted placements to use as values of the `placement` option.<br />
     * Valid placements are:
     * - `auto`
     * - `top`
     * - `right`
     * - `bottom`
     * - `left`
     *
     * Each placement can have a variation from this list:
     * - `-start`
     * - `-end`
     *
     * Variations are interpreted easily if you think of them as the left to right
     * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
     * is right.<br />
     * Vertically (`left` and `right`), `start` is top and `end` is bottom.
     *
     * Some valid examples are:
     * - `top-end` (on top of reference, right aligned)
     * - `right-start` (on right of reference, top aligned)
     * - `bottom` (on bottom, centered)
     * - `auto-right` (on the side with more space available, alignment depends by placement)
     *
     * @static
     * @type {Array}
     * @enum {String}
     * @readonly
     * @method placements
     * @memberof Popper
     */
    var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
    var validPlacements = placements.slice(3);

    /**
     * Given an initial placement, returns all the subsequent placements
     * clockwise (or counter-clockwise).
     *
     * @method
     * @memberof Popper.Utils
     * @argument {String} placement - A valid placement (it accepts variations)
     * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
     * @returns {Array} placements including their variations
     */
    function clockwise(placement) {
        var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var index = validPlacements.indexOf(placement);
        var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
        return counter ? arr.reverse() : arr;
    }

    var BEHAVIORS = {
        FLIP: 'flip',
        CLOCKWISE: 'clockwise',
        COUNTERCLOCKWISE: 'counterclockwise'
    };

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by update method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function flip(data, options) {
        // if `inner` modifier is enabled, we can't use the `flip` modifier
        if (isModifierEnabled(data.instance.modifiers, 'inner')) {
            return data;
        }

        if (data.flipped && data.placement === data.originalPlacement) {
            // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
            return data;
        }

        var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement);

        var placement = data.placement.split('-')[0];
        var placementOpposite = getOppositePlacement(placement);
        var variation = data.placement.split('-')[1] || '';

        var flipOrder = [];

        switch (options.behavior) {
            case BEHAVIORS.FLIP:
                flipOrder = [placement, placementOpposite];
                break;
            case BEHAVIORS.CLOCKWISE:
                flipOrder = clockwise(placement);
                break;
            case BEHAVIORS.COUNTERCLOCKWISE:
                flipOrder = clockwise(placement, true);
                break;
            default:
                flipOrder = options.behavior;
        }

        flipOrder.forEach(function (step, index) {
            if (placement !== step || flipOrder.length === index + 1) {
                return data;
            }

            placement = data.placement.split('-')[0];
            placementOpposite = getOppositePlacement(placement);

            var popperOffsets = data.offsets.popper;
            var refOffsets = data.offsets.reference;

            // using floor because the reference offsets may contain decimals we are not going to consider here
            var floor = Math.floor;
            var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

            var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
            var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
            var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
            var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

            var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

            // flip the variation if required
            var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
            var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

            if (overlapsRef || overflowsBoundaries || flippedVariation) {
                // this boolean to detect any flip loop
                data.flipped = true;

                if (overlapsRef || overflowsBoundaries) {
                    placement = flipOrder[index + 1];
                }

                if (flippedVariation) {
                    variation = getOppositeVariation(variation);
                }

                data.placement = placement + (variation ? '-' + variation : '');

                // this object contains `position`, we want to preserve it along with
                // any additional property we may add in the future
                data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

                data = runModifiers(data.instance.modifiers, data, 'flip');
            }
        });
        return data;
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by update method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function keepTogether(data) {
        var _data$offsets = data.offsets,
                popper = _data$offsets.popper,
                reference = _data$offsets.reference;

        var placement = data.placement.split('-')[0];
        var floor = Math.floor;
        var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
        var side = isVertical ? 'right' : 'bottom';
        var opSide = isVertical ? 'left' : 'top';
        var measurement = isVertical ? 'width' : 'height';

        if (popper[side] < floor(reference[opSide])) {
            data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
        }
        if (popper[opSide] > floor(reference[side])) {
            data.offsets.popper[opSide] = floor(reference[side]);
        }

        return data;
    }

    /**
     * Converts a string containing value + unit into a px value number
     * @function
     * @memberof {modifiers~offset}
     * @private
     * @argument {String} str - Value + unit string
     * @argument {String} measurement - `height` or `width`
     * @argument {Object} popperOffsets
     * @argument {Object} referenceOffsets
     * @returns {Number|String}
     * Value in pixels, or original string if no values were extracted
     */
    function toValue(str, measurement, popperOffsets, referenceOffsets) {
        // separate value from unit
        var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
        var value = +split[1];
        var unit = split[2];

        // If it's not a number it's an operator, I guess
        if (!value) {
            return str;
        }

        if (unit.indexOf('%') === 0) {
            var element = void 0;
            switch (unit) {
                case '%p':
                    element = popperOffsets;
                    break;
                case '%':
                case '%r':
                default:
                    element = referenceOffsets;
            }

            var rect = getClientRect(element);
            return rect[measurement] / 100 * value;
        } else if (unit === 'vh' || unit === 'vw') {
            // if is a vh or vw, we calculate the size based on the viewport
            var size = void 0;
            if (unit === 'vh') {
                size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            } else {
                size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            }
            return size / 100 * value;
        } else {
            // if is an explicit pixel unit, we get rid of the unit and keep the value
            // if is an implicit unit, it's px, and we return just the value
            return value;
        }
    }

    /**
     * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
     * @function
     * @memberof {modifiers~offset}
     * @private
     * @argument {String} offset
     * @argument {Object} popperOffsets
     * @argument {Object} referenceOffsets
     * @argument {String} basePlacement
     * @returns {Array} a two cells array with x and y offsets in numbers
     */
    function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
        var offsets = [0, 0];

        // Use height if placement is left or right and index is 0 otherwise use width
        // in this way the first offset will use an axis and the second one
        // will use the other one
        var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

        // Split the offset string to obtain a list of values and operands
        // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
        var fragments = offset.split(/(\+|\-)/).map(function (frag) {
            return frag.trim();
        });

        // Detect if the offset string contains a pair of values or a single one
        // they could be separated by comma or space
        var divider = fragments.indexOf(find(fragments, function (frag) {
            return frag.search(/,|\s/) !== -1;
        }));

        if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
            console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
        }

        // If divider is found, we divide the list of values and operands to divide
        // them by ofset X and Y.
        var splitRegex = /\s*,\s*|\s+/;
        var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

        // Convert the values with units to absolute pixels to allow our computations
        ops = ops.map(function (op, index) {
            // Most of the units rely on the orientation of the popper
            var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
            var mergeWithPrevious = false;
            return op
                    // This aggregates any `+` or `-` sign that aren't considered operators
                    // e.g.: 10 + +5 => [10, +, +5]
                    .reduce(function (a, b) {
                        if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
                            a[a.length - 1] = b;
                            mergeWithPrevious = true;
                            return a;
                        } else if (mergeWithPrevious) {
                            a[a.length - 1] += b;
                            mergeWithPrevious = false;
                            return a;
                        } else {
                            return a.concat(b);
                        }
                    }, [])
                    // Here we convert the string values into number values (in px)
                    .map(function (str) {
                        return toValue(str, measurement, popperOffsets, referenceOffsets);
                    });
        });

        // Loop trough the offsets arrays and execute the operations
        ops.forEach(function (op, index) {
            op.forEach(function (frag, index2) {
                if (isNumeric(frag)) {
                    offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
                }
            });
        });
        return offsets;
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by update method
     * @argument {Object} options - Modifiers configuration and options
     * @argument {Number|String} options.offset=0
     * The offset value as described in the modifier description
     * @returns {Object} The data object, properly modified
     */
    function offset(data, _ref) {
        var offset = _ref.offset;
        var placement = data.placement,
                _data$offsets = data.offsets,
                popper = _data$offsets.popper,
                reference = _data$offsets.reference;

        var basePlacement = placement.split('-')[0];

        var offsets = void 0;
        if (isNumeric(+offset)) {
            offsets = [+offset, 0];
        } else {
            offsets = parseOffset(offset, popper, reference, basePlacement);
        }

        if (basePlacement === 'left') {
            popper.top += offsets[0];
            popper.left -= offsets[1];
        } else if (basePlacement === 'right') {
            popper.top += offsets[0];
            popper.left += offsets[1];
        } else if (basePlacement === 'top') {
            popper.left += offsets[0];
            popper.top -= offsets[1];
        } else if (basePlacement === 'bottom') {
            popper.left += offsets[0];
            popper.top += offsets[1];
        }

        data.popper = popper;
        return data;
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by `update` method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function preventOverflow(data, options) {
        var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

        // If offsetParent is the reference element, we really want to
        // go one step up and use the next offsetParent as reference to
        // avoid to make this modifier completely useless and look like broken
        if (data.instance.reference === boundariesElement) {
            boundariesElement = getOffsetParent(boundariesElement);
        }

        var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement);
        options.boundaries = boundaries;

        var order = options.priority;
        var popper = data.offsets.popper;

        var check = {
            primary: function primary(placement) {
                var value = popper[placement];
                if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
                    value = Math.max(popper[placement], boundaries[placement]);
                }
                return defineProperty({}, placement, value);
            },
            secondary: function secondary(placement) {
                var mainSide = placement === 'right' ? 'left' : 'top';
                var value = popper[mainSide];
                if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
                    value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
                }
                return defineProperty({}, mainSide, value);
            }
        };

        order.forEach(function (placement) {
            var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
            popper = _extends({}, popper, check[side](placement));
        });

        data.offsets.popper = popper;

        return data;
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by `update` method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function shift(data) {
        var placement = data.placement;
        var basePlacement = placement.split('-')[0];
        var shiftvariation = placement.split('-')[1];

        // if shift shiftvariation is specified, run the modifier
        if (shiftvariation) {
            var _data$offsets = data.offsets,
                    reference = _data$offsets.reference,
                    popper = _data$offsets.popper;

            var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
            var side = isVertical ? 'left' : 'top';
            var measurement = isVertical ? 'width' : 'height';

            var shiftOffsets = {
                start: defineProperty({}, side, reference[side]),
                end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
            };

            data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
        }

        return data;
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by update method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function hide(data) {
        if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
            return data;
        }

        var refRect = data.offsets.reference;
        var bound = find(data.instance.modifiers, function (modifier) {
            return modifier.name === 'preventOverflow';
        }).boundaries;

        if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
            // Avoid unnecessary DOM access if visibility hasn't changed
            if (data.hide === true) {
                return data;
            }

            data.hide = true;
            data.attributes['x-out-of-boundaries'] = '';
        } else {
            // Avoid unnecessary DOM access if visibility hasn't changed
            if (data.hide === false) {
                return data;
            }

            data.hide = false;
            data.attributes['x-out-of-boundaries'] = false;
        }

        return data;
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by `update` method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function inner(data) {
        var placement = data.placement;
        var basePlacement = placement.split('-')[0];
        var _data$offsets = data.offsets,
                popper = _data$offsets.popper,
                reference = _data$offsets.reference;

        var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

        var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

        popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

        data.placement = getOppositePlacement(placement);
        data.offsets.popper = getClientRect(popper);

        return data;
    }

    /**
     * Modifier function, each modifier can have a function of this type assigned
     * to its `fn` property.<br />
     * These functions will be called on each update, this means that you must
     * make sure they are performant enough to avoid performance bottlenecks.
     *
     * @function ModifierFn
     * @argument {dataObject} data - The data object generated by `update` method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {dataObject} The data object, properly modified
     */

    /**
     * Modifiers are plugins used to alter the behavior of your poppers.<br />
     * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
     * needed by the library.
     *
     * Usually you don't want to override the `order`, `fn` and `onLoad` props.
     * All the other properties are configurations that could be tweaked.
     * @namespace modifiers
     */
    var modifiers = {
        /**
         * Modifier used to shift the popper on the start or end of its reference
         * element.<br />
         * It will read the variation of the `placement` property.<br />
         * It can be one either `-end` or `-start`.
         * @memberof modifiers
         * @inner
         */
        shift: {
            /** @prop {number} order=100 - Index used to define the order of execution */
            order: 100,
            /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
            enabled: true,
            /** @prop {ModifierFn} */
            fn: shift
        },

        /**
         * The `offset` modifier can shift your popper on both its axis.
         *
         * It accepts the following units:
         * - `px` or unitless, interpreted as pixels
         * - `%` or `%r`, percentage relative to the length of the reference element
         * - `%p`, percentage relative to the length of the popper element
         * - `vw`, CSS viewport width unit
         * - `vh`, CSS viewport height unit
         *
         * For length is intended the main axis relative to the placement of the popper.<br />
         * This means that if the placement is `top` or `bottom`, the length will be the
         * `width`. In case of `left` or `right`, it will be the height.
         *
         * You can provide a single value (as `Number` or `String`), or a pair of values
         * as `String` divided by a comma or one (or more) white spaces.<br />
         * The latter is a deprecated method because it leads to confusion and will be
         * removed in v2.<br />
         * Additionally, it accepts additions and subtractions between different units.
         * Note that multiplications and divisions aren't supported.
         *
         * Valid examples are:
         * ```
         * 10
         * '10%'
         * '10, 10'
         * '10%, 10'
         * '10 + 10%'
         * '10 - 5vh + 3%'
         * '-10px + 5vh, 5px - 6%'
         * ```
         * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
         * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
         * > More on this [reading this issue](https://github.com/FezVrasta/popper.js/issues/373)
         *
         * @memberof modifiers
         * @inner
         */
        offset: {
            /** @prop {number} order=200 - Index used to define the order of execution */
            order: 200,
            /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
            enabled: true,
            /** @prop {ModifierFn} */
            fn: offset,
            /** @prop {Number|String} offset=0
             * The offset value as described in the modifier description
             */
            offset: 0
        },

        /**
         * Modifier used to prevent the popper from being positioned outside the boundary.
         *
         * An scenario exists where the reference itself is not within the boundaries.<br />
         * We can say it has "escaped the boundaries" â€” or just "escaped".<br />
         * In this case we need to decide whether the popper should either:
         *
         * - detach from the reference and remain "trapped" in the boundaries, or
         * - if it should ignore the boundary and "escape with its reference"
         *
         * When `escapeWithReference` is set to`true` and reference is completely
         * outside its boundaries, the popper will overflow (or completely leave)
         * the boundaries in order to remain attached to the edge of the reference.
         *
         * @memberof modifiers
         * @inner
         */
        preventOverflow: {
            /** @prop {number} order=300 - Index used to define the order of execution */
            order: 300,
            /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
            enabled: true,
            /** @prop {ModifierFn} */
            fn: preventOverflow,
            /**
             * @prop {Array} [priority=['left','right','top','bottom']]
             * Popper will try to prevent overflow following these priorities by default,
             * then, it could overflow on the left and on top of the `boundariesElement`
             */
            priority: ['left', 'right', 'top', 'bottom'],
            /**
             * @prop {number} padding=5
             * Amount of pixel used to define a minimum distance between the boundaries
             * and the popper this makes sure the popper has always a little padding
             * between the edges of its container
             */
            padding: 5,
            /**
             * @prop {String|HTMLElement} boundariesElement='scrollParent'
             * Boundaries used by the modifier, can be `scrollParent`, `window`,
             * `viewport` or any DOM element.
             */
            boundariesElement: 'scrollParent'
        },

        /**
         * Modifier used to make sure the reference and its popper stay near eachothers
         * without leaving any gap between the two. Expecially useful when the arrow is
         * enabled and you want to assure it to point to its reference element.
         * It cares only about the first axis, you can still have poppers with margin
         * between the popper and its reference element.
         * @memberof modifiers
         * @inner
         */
        keepTogether: {
            /** @prop {number} order=400 - Index used to define the order of execution */
            order: 400,
            /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
            enabled: true,
            /** @prop {ModifierFn} */
            fn: keepTogether
        },

        /**
         * This modifier is used to move the `arrowElement` of the popper to make
         * sure it is positioned between the reference element and its popper element.
         * It will read the outer size of the `arrowElement` node to detect how many
         * pixels of conjuction are needed.
         *
         * It has no effect if no `arrowElement` is provided.
         * @memberof modifiers
         * @inner
         */
        arrow: {
            /** @prop {number} order=500 - Index used to define the order of execution */
            order: 500,
            /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
            enabled: true,
            /** @prop {ModifierFn} */
            fn: arrow,
            /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
            element: '[x-arrow]'
        },

        /**
         * Modifier used to flip the popper's placement when it starts to overlap its
         * reference element.
         *
         * Requires the `preventOverflow` modifier before it in order to work.
         *
         * **NOTE:** this modifier will interrupt the current update cycle and will
         * restart it if it detects the need to flip the placement.
         * @memberof modifiers
         * @inner
         */
        flip: {
            /** @prop {number} order=600 - Index used to define the order of execution */
            order: 600,
            /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
            enabled: true,
            /** @prop {ModifierFn} */
            fn: flip,
            /**
             * @prop {String|Array} behavior='flip'
             * The behavior used to change the popper's placement. It can be one of
             * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
             * placements (with optional variations).
             */
            behavior: 'flip',
            /**
             * @prop {number} padding=5
             * The popper will flip if it hits the edges of the `boundariesElement`
             */
            padding: 5,
            /**
             * @prop {String|HTMLElement} boundariesElement='viewport'
             * The element which will define the boundaries of the popper position,
             * the popper will never be placed outside of the defined boundaries
             * (except if keepTogether is enabled)
             */
            boundariesElement: 'viewport'
        },

        /**
         * Modifier used to make the popper flow toward the inner of the reference element.
         * By default, when this modifier is disabled, the popper will be placed outside
         * the reference element.
         * @memberof modifiers
         * @inner
         */
        inner: {
            /** @prop {number} order=700 - Index used to define the order of execution */
            order: 700,
            /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
            enabled: false,
            /** @prop {ModifierFn} */
            fn: inner
        },

        /**
         * Modifier used to hide the popper when its reference element is outside of the
         * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
         * be used to hide with a CSS selector the popper when its reference is
         * out of boundaries.
         *
         * Requires the `preventOverflow` modifier before it in order to work.
         * @memberof modifiers
         * @inner
         */
        hide: {
            /** @prop {number} order=800 - Index used to define the order of execution */
            order: 800,
            /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
            enabled: true,
            /** @prop {ModifierFn} */
            fn: hide
        },

        /**
         * Computes the style that will be applied to the popper element to gets
         * properly positioned.
         *
         * Note that this modifier will not touch the DOM, it just prepares the styles
         * so that `applyStyle` modifier can apply it. This separation is useful
         * in case you need to replace `applyStyle` with a custom implementation.
         *
         * This modifier has `850` as `order` value to maintain backward compatibility
         * with previous versions of Popper.js. Expect the modifiers ordering method
         * to change in future major versions of the library.
         *
         * @memberof modifiers
         * @inner
         */
        computeStyle: {
            /** @prop {number} order=850 - Index used to define the order of execution */
            order: 850,
            /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
            enabled: true,
            /** @prop {ModifierFn} */
            fn: computeStyle,
            /**
             * @prop {Boolean} gpuAcceleration=true
             * If true, it uses the CSS 3d transformation to position the popper.
             * Otherwise, it will use the `top` and `left` properties.
             */
            gpuAcceleration: true,
            /**
             * @prop {string} [x='bottom']
             * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
             * Change this if your popper should grow in a direction different from `bottom`
             */
            x: 'bottom',
            /**
             * @prop {string} [x='left']
             * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
             * Change this if your popper should grow in a direction different from `right`
             */
            y: 'right'
        },

        /**
         * Applies the computed styles to the popper element.
         *
         * All the DOM manipulations are limited to this modifier. This is useful in case
         * you want to integrate Popper.js inside a framework or view library and you
         * want to delegate all the DOM manipulations to it.
         *
         * Note that if you disable this modifier, you must make sure the popper element
         * has its position set to `absolute` before Popper.js can do its work!
         *
         * Just disable this modifier and define you own to achieve the desired effect.
         *
         * @memberof modifiers
         * @inner
         */
        applyStyle: {
            /** @prop {number} order=900 - Index used to define the order of execution */
            order: 900,
            /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
            enabled: true,
            /** @prop {ModifierFn} */
            fn: applyStyle,
            /** @prop {Function} */
            onLoad: applyStyleOnLoad,
            /**
             * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
             * @prop {Boolean} gpuAcceleration=true
             * If true, it uses the CSS 3d transformation to position the popper.
             * Otherwise, it will use the `top` and `left` properties.
             */
            gpuAcceleration: undefined
        }
    };

    /**
     * The `dataObject` is an object containing all the informations used by Popper.js
     * this object get passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
     * @name dataObject
     * @property {Object} data.instance The Popper.js instance
     * @property {String} data.placement Placement applied to popper
     * @property {String} data.originalPlacement Placement originally defined on init
     * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
     * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper.
     * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
     * @property {Object} data.styles Any CSS property defined here will be applied to the popper, it expects the JavaScript nomenclature (eg. `marginBottom`)
     * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow, it expects the JavaScript nomenclature (eg. `marginBottom`)
     * @property {Object} data.boundaries Offsets of the popper boundaries
     * @property {Object} data.offsets The measurements of popper, reference and arrow elements.
     * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
     * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
     * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
     */

    /**
     * Default options provided to Popper.js constructor.<br />
     * These can be overriden using the `options` argument of Popper.js.<br />
     * To override an option, simply pass as 3rd argument an object with the same
     * structure of this object, example:
     * ```
     * new Popper(ref, pop, {
     *   modifiers: {
     *     preventOverflow: { enabled: false }
     *   }
     * })
     * ```
     * @type {Object}
     * @static
     * @memberof Popper
     */
    var Defaults = {
        /**
         * Popper's placement
         * @prop {Popper.placements} placement='bottom'
         */
        placement: 'bottom',

        /**
         * Whether events (resize, scroll) are initially enabled
         * @prop {Boolean} eventsEnabled=true
         */
        eventsEnabled: true,

        /**
         * Set to true if you want to automatically remove the popper when
         * you call the `destroy` method.
         * @prop {Boolean} removeOnDestroy=false
         */
        removeOnDestroy: false,

        /**
         * Callback called when the popper is created.<br />
         * By default, is set to no-op.<br />
         * Access Popper.js instance with `data.instance`.
         * @prop {onCreate}
         */
        onCreate: function onCreate() {},

        /**
         * Callback called when the popper is updated, this callback is not called
         * on the initialization/creation of the popper, but only on subsequent
         * updates.<br />
         * By default, is set to no-op.<br />
         * Access Popper.js instance with `data.instance`.
         * @prop {onUpdate}
         */
        onUpdate: function onUpdate() {},

        /**
         * List of modifiers used to modify the offsets before they are applied to the popper.
         * They provide most of the functionalities of Popper.js
         * @prop {modifiers}
         */
        modifiers: modifiers
    };

    /**
     * @callback onCreate
     * @param {dataObject} data
     */

    /**
     * @callback onUpdate
     * @param {dataObject} data
     */

// Utils
// Methods
    var Popper = function () {
        /**
         * Create a new Popper.js instance
         * @class Popper
         * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
         * @param {HTMLElement} popper - The HTML element used as popper.
         * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
         * @return {Object} instance - The generated Popper.js instance
         */
        function Popper(reference, popper) {
            var _this = this;

            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            classCallCheck(this, Popper);

            this.scheduleUpdate = function () {
                return requestAnimationFrame(_this.update);
            };

            // make update() debounced, so that it only runs at most once-per-tick
            this.update = debounce(this.update.bind(this));

            // with {} we create a new object with the options inside it
            this.options = _extends({}, Popper.Defaults, options);

            // init state
            this.state = {
                isDestroyed: false,
                isCreated: false,
                scrollParents: []
            };

            // get reference and popper elements (allow jQuery wrappers)
            this.reference = reference && reference.jquery ? reference[0] : reference;
            this.popper = popper && popper.jquery ? popper[0] : popper;

            // Deep merge modifiers options
            this.options.modifiers = {};
            Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
                _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
            });

            // Refactoring modifiers' list (Object => Array)
            this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
                return _extends({
                    name: name
                }, _this.options.modifiers[name]);
            })
                    // sort the modifiers by order
                    .sort(function (a, b) {
                        return a.order - b.order;
                    });

            // modifiers have the ability to execute arbitrary code when Popper.js get inited
            // such code is executed in the same order of its modifier
            // they could add new properties to their options configuration
            // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
            this.modifiers.forEach(function (modifierOptions) {
                if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
                    modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
                }
            });

            // fire the first update to position the popper in the right place
            this.update();

            var eventsEnabled = this.options.eventsEnabled;
            if (eventsEnabled) {
                // setup event listeners, they will take care of update the position in specific situations
                this.enableEventListeners();
            }

            this.state.eventsEnabled = eventsEnabled;
        }

        // We can't use class properties because they don't get listed in the
        // class prototype and break stuff like Sinon stubs


        createClass(Popper, [{
                key: 'update',
                value: function update$$1() {
                    return update.call(this);
                }
            }, {
                key: 'destroy',
                value: function destroy$$1() {
                    return destroy.call(this);
                }
            }, {
                key: 'enableEventListeners',
                value: function enableEventListeners$$1() {
                    return enableEventListeners.call(this);
                }
            }, {
                key: 'disableEventListeners',
                value: function disableEventListeners$$1() {
                    return disableEventListeners.call(this);
                }

                /**
                 * Schedule an update, it will run on the next UI update available
                 * @method scheduleUpdate
                 * @memberof Popper
                 */


                /**
                 * Collection of utilities useful when writing custom modifiers.
                 * Starting from version 1.7, this method is available only if you
                 * include `popper-utils.js` before `popper.js`.
                 *
                 * **DEPRECATION**: This way to access PopperUtils is deprecated
                 * and will be removed in v2! Use the PopperUtils module directly instead.
                 * Due to the high instability of the methods contained in Utils, we can't
                 * guarantee them to follow semver. Use them at your own risk!
                 * @static
                 * @private
                 * @type {Object}
                 * @deprecated since version 1.8
                 * @member Utils
                 * @memberof Popper
                 */

            }]);
        return Popper;
    }();

    /**
     * The `referenceObject` is an object that provides an interface compatible with Popper.js
     * and lets you use it as replacement of a real DOM node.<br />
     * You can use this method to position a popper relatively to a set of coordinates
     * in case you don't have a DOM node to use as reference.
     *
     * ```
     * new Popper(referenceObject, popperNode);
     * ```
     *
     * NB: This feature isn't supported in Internet Explorer 10
     * @name referenceObject
     * @property {Function} data.getBoundingClientRect
     * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
     * @property {number} data.clientWidth
     * An ES6 getter that will return the width of the virtual reference element.
     * @property {number} data.clientHeight
     * An ES6 getter that will return the height of the virtual reference element.
     */


    Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
    Popper.placements = placements;
    Popper.Defaults = Defaults;

    return Popper;

})));
//# sourceMappingURL=popper.js.map


/*
 Copyright (C) Federico Zivolo 2019
 Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).
 */ (function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
            ? (module.exports = t())
            : "function" == typeof define && define.amd
            ? define(t)
            : (e.Popper = t());
})(this, function () {
    "use strict";
    function e(e) {
        return e && "[object Function]" === {}.toString.call(e);
    }
    function t(e, t) {
        if (1 !== e.nodeType)
            return [];
        var o = e.ownerDocument.defaultView,
                n = o.getComputedStyle(e, null);
        return t ? n[t] : n;
    }
    function o(e) {
        return "HTML" === e.nodeName ? e : e.parentNode || e.host;
    }
    function n(e) {
        if (!e)
            return document.body;
        switch (e.nodeName) {
            case "HTML":
            case "BODY":
                return e.ownerDocument.body;
            case "#document":
                return e.body;
        }
        var i = t(e),
                r = i.overflow,
                p = i.overflowX,
                s = i.overflowY;
        return /(auto|scroll|overlay)/.test(r + s + p) ? e : n(o(e));
    }
    function r(e) {
        return 11 === e ? pe : 10 === e ? se : pe || se;
    }
    function p(e) {
        if (!e)
            return document.documentElement;
        for (
                var o = r(10) ? document.body : null, n = e.offsetParent || null;
                n === o && e.nextElementSibling;
                )
            n = (e = e.nextElementSibling).offsetParent;
        var i = n && n.nodeName;
        return i && "BODY" !== i && "HTML" !== i
                ? -1 !== ["TH", "TD", "TABLE"].indexOf(n.nodeName) &&
                "static" === t(n, "position")
                ? p(n)
                : n
                : e
                ? e.ownerDocument.documentElement
                : document.documentElement;
    }
    function s(e) {
        var t = e.nodeName;
        return "BODY" !== t && ("HTML" === t || p(e.firstElementChild) === e);
    }
    function d(e) {
        return null === e.parentNode ? e : d(e.parentNode);
    }
    function a(e, t) {
        if (!e || !e.nodeType || !t || !t.nodeType)
            return document.documentElement;
        var o = e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING,
                n = o ? e : t,
                i = o ? t : e,
                r = document.createRange();
        r.setStart(n, 0), r.setEnd(i, 0);
        var l = r.commonAncestorContainer;
        if ((e !== l && t !== l) || n.contains(i))
            return s(l) ? l : p(l);
        var f = d(e);
        return f.host ? a(f.host, t) : a(e, d(t).host);
    }
    function l(e) {
        var t =
                1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "top",
                o = "top" === t ? "scrollTop" : "scrollLeft",
                n = e.nodeName;
        if ("BODY" === n || "HTML" === n) {
            var i = e.ownerDocument.documentElement,
                    r = e.ownerDocument.scrollingElement || i;
            return r[o];
        }
        return e[o];
    }
    function f(e, t) {
        var o = 2 < arguments.length && void 0 !== arguments[2] && arguments[2],
                n = l(t, "top"),
                i = l(t, "left"),
                r = o ? -1 : 1;
        return (
                (e.top += n * r),
                (e.bottom += n * r),
                (e.left += i * r),
                (e.right += i * r),
                e
                );
    }
    function m(e, t) {
        var o = "x" === t ? "Left" : "Top",
                n = "Left" == o ? "Right" : "Bottom";
        return (
                parseFloat(e["border" + o + "Width"], 10) +
                parseFloat(e["border" + n + "Width"], 10)
                );
    }
    function h(e, t, o, n) {
        return ee(
                t["offset" + e],
                t["scroll" + e],
                o["client" + e],
                o["offset" + e],
                o["scroll" + e],
                r(10)
                ? parseInt(o["offset" + e]) +
                parseInt(n["margin" + ("Height" === e ? "Top" : "Left")]) +
                parseInt(n["margin" + ("Height" === e ? "Bottom" : "Right")])
                : 0
                );
    }
    function c(e) {
        var t = e.body,
                o = e.documentElement,
                n = r(10) && getComputedStyle(o);
        return {height: h("Height", t, o, n), width: h("Width", t, o, n)};
    }
    function g(e) {
        return fe({}, e, {right: e.left + e.width, bottom: e.top + e.height});
    }
    function u(e) {
        var o = {};
        try {
            if (r(10)) {
                o = e.getBoundingClientRect();
                var n = l(e, "top"),
                        i = l(e, "left");
                (o.top += n), (o.left += i), (o.bottom += n), (o.right += i);
            } else
                o = e.getBoundingClientRect();
        } catch (t) {
        }
        var p = {
            left: o.left,
            top: o.top,
            width: o.right - o.left,
            height: o.bottom - o.top,
        },
                s = "HTML" === e.nodeName ? c(e.ownerDocument) : {},
                d = s.width || e.clientWidth || p.right - p.left,
                a = s.height || e.clientHeight || p.bottom - p.top,
                f = e.offsetWidth - d,
                h = e.offsetHeight - a;
        if (f || h) {
            var u = t(e);
            (f -= m(u, "x")), (h -= m(u, "y")), (p.width -= f), (p.height -= h);
        }
        return g(p);
    }
    function b(e, o) {
        var i = 2 < arguments.length && void 0 !== arguments[2] && arguments[2],
                p = r(10),
                s = "HTML" === o.nodeName,
                d = u(e),
                a = u(o),
                l = n(e),
                m = t(o),
                h = parseFloat(m.borderTopWidth, 10),
                c = parseFloat(m.borderLeftWidth, 10);
        i && s && ((a.top = ee(a.top, 0)), (a.left = ee(a.left, 0)));
        var b = g({
            top: d.top - a.top - h,
            left: d.left - a.left - c,
            width: d.width,
            height: d.height,
        });
        if (((b.marginTop = 0), (b.marginLeft = 0), !p && s)) {
            var w = parseFloat(m.marginTop, 10),
                    y = parseFloat(m.marginLeft, 10);
            (b.top -= h - w),
                    (b.bottom -= h - w),
                    (b.left -= c - y),
                    (b.right -= c - y),
                    (b.marginTop = w),
                    (b.marginLeft = y);
        }
        return (
                (p && !i ? o.contains(l) : o === l && "BODY" !== l.nodeName) &&
                (b = f(b, o)),
                b
                );
    }
    function w(e) {
        var t = 1 < arguments.length && void 0 !== arguments[1] && arguments[1],
                o = e.ownerDocument.documentElement,
                n = b(e, o),
                i = ee(o.clientWidth, window.innerWidth || 0),
                r = ee(o.clientHeight, window.innerHeight || 0),
                p = t ? 0 : l(o),
                s = t ? 0 : l(o, "left"),
                d = {
                    top: p - n.top + n.marginTop,
                    left: s - n.left + n.marginLeft,
                    width: i,
                    height: r,
                };
        return g(d);
    }
    function y(e) {
        var n = e.nodeName;
        if ("BODY" === n || "HTML" === n)
            return !1;
        if ("fixed" === t(e, "position"))
            return !0;
        var i = o(e);
        return !!i && y(i);
    }
    function E(e) {
        if (!e || !e.parentElement || r())
            return document.documentElement;
        for (var o = e.parentElement; o && "none" === t(o, "transform"); )
            o = o.parentElement;
        return o || document.documentElement;
    }
    function v(e, t, i, r) {
        var p = 4 < arguments.length && void 0 !== arguments[4] && arguments[4],
                s = {top: 0, left: 0},
                d = p ? E(e) : a(e, t);
        if ("viewport" === r)
            s = w(d, p);
        else {
            var l;
            "scrollParent" === r
                    ? ((l = n(o(t))),
                            "BODY" === l.nodeName && (l = e.ownerDocument.documentElement))
                    : "window" === r
                    ? (l = e.ownerDocument.documentElement)
                    : (l = r);
            var f = b(l, d, p);
            if ("HTML" === l.nodeName && !y(d)) {
                var m = c(e.ownerDocument),
                        h = m.height,
                        g = m.width;
                (s.top += f.top - f.marginTop),
                        (s.bottom = h + f.top),
                        (s.left += f.left - f.marginLeft),
                        (s.right = g + f.left);
            } else
                s = f;
        }
        i = i || 0;
        var u = "number" == typeof i;
        return (
                (s.left += u ? i : i.left || 0),
                (s.top += u ? i : i.top || 0),
                (s.right -= u ? i : i.right || 0),
                (s.bottom -= u ? i : i.bottom || 0),
                s
                );
    }
    function x(e) {
        var t = e.width,
                o = e.height;
        return t * o;
    }
    function O(e, t, o, n, i) {
        var r = 5 < arguments.length && void 0 !== arguments[5] ? arguments[5] : 0;
        if (-1 === e.indexOf("auto"))
            return e;
        var p = v(o, n, r, i),
                s = {
                    top: {width: p.width, height: t.top - p.top},
                    right: {width: p.right - t.right, height: p.height},
                    bottom: {width: p.width, height: p.bottom - t.bottom},
                    left: {width: t.left - p.left, height: p.height},
                },
                d = Object.keys(s)
                .map(function (e) {
                    return fe({key: e}, s[e], {area: x(s[e])});
                })
                .sort(function (e, t) {
                    return t.area - e.area;
                }),
                a = d.filter(function (e) {
                    var t = e.width,
                            n = e.height;
                    return t >= o.clientWidth && n >= o.clientHeight;
                }),
                l = 0 < a.length ? a[0].key : d[0].key,
                f = e.split("-")[1];
        return l + (f ? "-" + f : "");
    }
    function L(e, t, o) {
        var n =
                3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null,
                i = n ? E(t) : a(t, o);
        return b(o, i, n);
    }
    function S(e) {
        var t = e.ownerDocument.defaultView,
                o = t.getComputedStyle(e),
                n = parseFloat(o.marginTop || 0) + parseFloat(o.marginBottom || 0),
                i = parseFloat(o.marginLeft || 0) + parseFloat(o.marginRight || 0),
                r = {width: e.offsetWidth + i, height: e.offsetHeight + n};
        return r;
    }
    function T(e) {
        var t = {left: "right", right: "left", bottom: "top", top: "bottom"};
        return e.replace(/left|right|bottom|top/g, function (e) {
            return t[e];
        });
    }
    function D(e, t, o) {
        o = o.split("-")[0];
        var n = S(e),
                i = {width: n.width, height: n.height},
                r = -1 !== ["right", "left"].indexOf(o),
                p = r ? "top" : "left",
                s = r ? "left" : "top",
                d = r ? "height" : "width",
                a = r ? "width" : "height";
        return (
                (i[p] = t[p] + t[d] / 2 - n[d] / 2),
                (i[s] = o === s ? t[s] - n[a] : t[T(s)]),
                i
                );
    }
    function C(e, t) {
        return Array.prototype.find ? e.find(t) : e.filter(t)[0];
    }
    function N(e, t, o) {
        if (Array.prototype.findIndex)
            return e.findIndex(function (e) {
                return e[t] === o;
            });
        var n = C(e, function (e) {
            return e[t] === o;
        });
        return e.indexOf(n);
    }
    function P(t, o, n) {
        var i = void 0 === n ? t : t.slice(0, N(t, "name", n));
        return (
                i.forEach(function (t) {
                    t["function"] &&
                            console.warn("`modifier.function` is deprecated, use `modifier.fn`!");
                    var n = t["function"] || t.fn;
                    t.enabled &&
                            e(n) &&
                            ((o.offsets.popper = g(o.offsets.popper)),
                                    (o.offsets.reference = g(o.offsets.reference)),
                                    (o = n(o, t)));
                }),
                o
                );
    }
    function k() {
        if (!this.state.isDestroyed) {
            var e = {
                instance: this,
                styles: {},
                arrowStyles: {},
                attributes: {},
                flipped: !1,
                offsets: {},
            };
            (e.offsets.reference = L(
                    this.state,
                    this.popper,
                    this.reference,
                    this.options.positionFixed
                    )),
                    (e.placement = O(
                            this.options.placement,
                            e.offsets.reference,
                            this.popper,
                            this.reference,
                            this.options.modifiers.flip.boundariesElement,
                            this.options.modifiers.flip.padding
                            )),
                    (e.originalPlacement = e.placement),
                    (e.positionFixed = this.options.positionFixed),
                    (e.offsets.popper = D(this.popper, e.offsets.reference, e.placement)),
                    (e.offsets.popper.position = this.options.positionFixed
                            ? "fixed"
                            : "absolute"),
                    (e = P(this.modifiers, e)),
                    this.state.isCreated
                    ? this.options.onUpdate(e)
                    : ((this.state.isCreated = !0), this.options.onCreate(e));
        }
    }
    function W(e, t) {
        return e.some(function (e) {
            var o = e.name,
                    n = e.enabled;
            return n && o === t;
        });
    }
    function H(e) {
        for (
                var t = [!1, "ms", "Webkit", "Moz", "O"],
                o = e.charAt(0).toUpperCase() + e.slice(1),
                n = 0;
                n < t.length;
                n++
                ) {
            var i = t[n],
                    r = i ? "" + i + o : e;
            if ("undefined" != typeof document.body.style[r])
                return r;
        }
        return null;
    }
    function B() {
        return (
                (this.state.isDestroyed = !0),
                W(this.modifiers, "applyStyle") &&
                (this.popper.removeAttribute("x-placement"),
                        (this.popper.style.position = ""),
                        (this.popper.style.top = ""),
                        (this.popper.style.left = ""),
                        (this.popper.style.right = ""),
                        (this.popper.style.bottom = ""),
                        (this.popper.style.willChange = ""),
                        (this.popper.style[H("transform")] = "")),
                this.disableEventListeners(),
                this.options.removeOnDestroy &&
                this.popper.parentNode.removeChild(this.popper),
                this
                );
    }
    function A(e) {
        var t = e.ownerDocument;
        return t ? t.defaultView : window;
    }
    function M(e, t, o, i) {
        var r = "BODY" === e.nodeName,
                p = r ? e.ownerDocument.defaultView : e;
        p.addEventListener(t, o, {passive: !0}),
                r || M(n(p.parentNode), t, o, i),
                i.push(p);
    }
    function F(e, t, o, i) {
        (o.updateBound = i),
                A(e).addEventListener("resize", o.updateBound, {passive: !0});
        var r = n(e);
        return (
                M(r, "scroll", o.updateBound, o.scrollParents),
                (o.scrollElement = r),
                (o.eventsEnabled = !0),
                o
                );
    }
    function I() {
        this.state.eventsEnabled ||
                (this.state = F(
                        this.reference,
                        this.options,
                        this.state,
                        this.scheduleUpdate
                        ));
    }
    function R(e, t) {
        return (
                A(e).removeEventListener("resize", t.updateBound),
                t.scrollParents.forEach(function (e) {
                    e.removeEventListener("scroll", t.updateBound);
                }),
                (t.updateBound = null),
                (t.scrollParents = []),
                (t.scrollElement = null),
                (t.eventsEnabled = !1),
                t
                );
    }
    function U() {
        this.state.eventsEnabled &&
                (cancelAnimationFrame(this.scheduleUpdate),
                        (this.state = R(this.reference, this.state)));
    }
    function Y(e) {
        return "" !== e && !isNaN(parseFloat(e)) && isFinite(e);
    }
    function j(e, t) {
        Object.keys(t).forEach(function (o) {
            var n = "";
            -1 !== ["width", "height", "top", "right", "bottom", "left"].indexOf(o) &&
                    Y(t[o]) &&
                    (n = "px"),
                    (e.style[o] = t[o] + n);
        });
    }
    function V(e, t) {
        Object.keys(t).forEach(function (o) {
            var n = t[o];
            !1 === n ? e.removeAttribute(o) : e.setAttribute(o, t[o]);
        });
    }
    function q(e, t) {
        var o = e.offsets,
                n = o.popper,
                i = o.reference,
                r = $,
                p = function (e) {
                    return e;
                },
                s = r(i.width),
                d = r(n.width),
                a = -1 !== ["left", "right"].indexOf(e.placement),
                l = -1 !== e.placement.indexOf("-"),
                f = t ? (a || l || s % 2 == d % 2 ? r : Z) : p,
                m = t ? r : p;
        return {
            left: f(1 == s % 2 && 1 == d % 2 && !l && t ? n.left - 1 : n.left),
            top: m(n.top),
            bottom: m(n.bottom),
            right: f(n.right),
        };
    }
    function K(e, t, o) {
        var n = C(e, function (e) {
            var o = e.name;
            return o === t;
        }),
                i =
                !!n &&
                e.some(function (e) {
                    return e.name === o && e.enabled && e.order < n.order;
                });
        if (!i) {
            var r = "`" + t + "`";
            console.warn(
                    "`" +
                    o +
                    "`" +
                    " modifier is required by " +
                    r +
                    " modifier in order to work, be sure to include it before " +
                    r +
                    "!"
                    );
        }
        return i;
    }
    function z(e) {
        return "end" === e ? "start" : "start" === e ? "end" : e;
    }
    function G(e) {
        var t = 1 < arguments.length && void 0 !== arguments[1] && arguments[1],
                o = ce.indexOf(e),
                n = ce.slice(o + 1).concat(ce.slice(0, o));
        return t ? n.reverse() : n;
    }
    function _(e, t, o, n) {
        var i = e.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),
                r = +i[1],
                p = i[2];
        if (!r)
            return e;
        if (0 === p.indexOf("%")) {
            var s;
            switch (p) {
                case "%p":
                    s = o;
                    break;
                case "%":
                case "%r":
                default:
                    s = n;
            }
            var d = g(s);
            return (d[t] / 100) * r;
        }
        if ("vh" === p || "vw" === p) {
            var a;
            return (
                    (a =
                            "vh" === p
                            ? ee(document.documentElement.clientHeight, window.innerHeight || 0)
                            : ee(document.documentElement.clientWidth, window.innerWidth || 0)),
                    (a / 100) * r
                    );
        }
        return r;
    }
    function X(e, t, o, n) {
        var i = [0, 0],
                r = -1 !== ["right", "left"].indexOf(n),
                p = e.split(/(\+|\-)/).map(function (e) {
            return e.trim();
        }),
                s = p.indexOf(
                        C(p, function (e) {
                            return -1 !== e.search(/,|\s/);
                        })
                        );
        p[s] &&
                -1 === p[s].indexOf(",") &&
                console.warn(
                        "Offsets separated by white space(s) are deprecated, use a comma (,) instead."
                        );
        var d = /\s*,\s*|\s+/,
                a =
                -1 === s
                ? [p]
                : [
                    p.slice(0, s).concat([p[s].split(d)[0]]),
                    [p[s].split(d)[1]].concat(p.slice(s + 1)),
                ];
        return (
                (a = a.map(function (e, n) {
                    var i = (1 === n ? !r : r) ? "height" : "width",
                            p = !1;
                    return e
                            .reduce(function (e, t) {
                                return "" === e[e.length - 1] && -1 !== ["+", "-"].indexOf(t)
                                        ? ((e[e.length - 1] = t), (p = !0), e)
                                        : p
                                        ? ((e[e.length - 1] += t), (p = !1), e)
                                        : e.concat(t);
                            }, [])
                            .map(function (e) {
                                return _(e, i, t, o);
                            });
                })),
                a.forEach(function (e, t) {
                    e.forEach(function (o, n) {
                        Y(o) && (i[t] += o * ("-" === e[n - 1] ? -1 : 1));
                    });
                }),
                i
                );
    }
    function J(e, t) {
        var o,
                n = t.offset,
                i = e.placement,
                r = e.offsets,
                p = r.popper,
                s = r.reference,
                d = i.split("-")[0];
        return (
                (o = Y(+n) ? [+n, 0] : X(n, p, s, d)),
                "left" === d
                ? ((p.top += o[0]), (p.left -= o[1]))
                : "right" === d
                ? ((p.top += o[0]), (p.left += o[1]))
                : "top" === d
                ? ((p.left += o[0]), (p.top -= o[1]))
                : "bottom" === d && ((p.left += o[0]), (p.top += o[1])),
                (e.popper = p),
                e
                );
    }
    for (
            var Q = Math.min,
            Z = Math.floor,
            $ = Math.round,
            ee = Math.max,
            te = "undefined" != typeof window && "undefined" != typeof document,
            oe = ["Edge", "Trident", "Firefox"],
            ne = 0,
            ie = 0;
            ie < oe.length;
            ie += 1
            )
        if (te && 0 <= navigator.userAgent.indexOf(oe[ie])) {
            ne = 1;
            break;
        }
    var i = te && window.Promise,
            re = i
            ? function (e) {
                var t = !1;
                return function () {
                    t ||
                            ((t = !0),
                                    window.Promise.resolve().then(function () {
                                (t = !1), e();
                            }));
                };
            }
    : function (e) {
        var t = !1;
        return function () {
            t ||
                    ((t = !0),
                            setTimeout(function () {
                                (t = !1), e();
                            }, ne));
        };
    },
            pe = te && !!(window.MSInputMethodContext && document.documentMode),
            se = te && /MSIE 10/.test(navigator.userAgent),
            de = function (e, t) {
                if (!(e instanceof t))
                    throw new TypeError("Cannot call a class as a function");
            },
            ae = (function () {
                function e(e, t) {
                    for (var o, n = 0; n < t.length; n++)
                        (o = t[n]),
                                (o.enumerable = o.enumerable || !1),
                                (o.configurable = !0),
                                "value" in o && (o.writable = !0),
                                Object.defineProperty(e, o.key, o);
                }
                return function (t, o, n) {
                    return o && e(t.prototype, o), n && e(t, n), t;
                };
            })(),
            le = function (e, t, o) {
                return (
                        t in e
                        ? Object.defineProperty(e, t, {
                            value: o,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0,
                        })
                        : (e[t] = o),
                        e
                        );
            },
            fe =
            Object.assign ||
            function (e) {
                for (var t, o = 1; o < arguments.length; o++)
                    for (var n in ((t = arguments[o]), t))
                        Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
                return e;
            },
            me = te && /Firefox/i.test(navigator.userAgent),
            he = [
                "auto-start",
                "auto",
                "auto-end",
                "top-start",
                "top",
                "top-end",
                "right-start",
                "right",
                "right-end",
                "bottom-end",
                "bottom",
                "bottom-start",
                "left-end",
                "left",
                "left-start",
            ],
            ce = he.slice(3),
            ge = {
                FLIP: "flip",
                CLOCKWISE: "clockwise",
                COUNTERCLOCKWISE: "counterclockwise",
            },
            ue = (function () {
                function t(o, n) {
                    var i = this,
                            r =
                            2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
                    de(this, t),
                            (this.scheduleUpdate = function () {
                                return requestAnimationFrame(i.update);
                            }),
                            (this.update = re(this.update.bind(this))),
                            (this.options = fe({}, t.Defaults, r)),
                            (this.state = {isDestroyed: !1, isCreated: !1, scrollParents: []}),
                            (this.reference = o && o.jquery ? o[0] : o),
                            (this.popper = n && n.jquery ? n[0] : n),
                            (this.options.modifiers = {}),
                            Object.keys(fe({}, t.Defaults.modifiers, r.modifiers)).forEach(
                            function (e) {
                                i.options.modifiers[e] = fe(
                                        {},
                                        t.Defaults.modifiers[e] || {},
                                        r.modifiers ? r.modifiers[e] : {}
                                );
                            }
                    ),
                            (this.modifiers = Object.keys(this.options.modifiers)
                                    .map(function (e) {
                                        return fe({name: e}, i.options.modifiers[e]);
                                    })
                                    .sort(function (e, t) {
                                        return e.order - t.order;
                                    })),
                            this.modifiers.forEach(function (t) {
                                t.enabled &&
                                        e(t.onLoad) &&
                                        t.onLoad(i.reference, i.popper, i.options, t, i.state);
                            }),
                            this.update();
                    var p = this.options.eventsEnabled;
                    p && this.enableEventListeners(), (this.state.eventsEnabled = p);
                }
                return (
                        ae(t, [
                            {
                                key: "update",
                                value: function () {
                                    return k.call(this);
                                },
                            },
                            {
                                key: "destroy",
                                value: function () {
                                    return B.call(this);
                                },
                            },
                            {
                                key: "enableEventListeners",
                                value: function () {
                                    return I.call(this);
                                },
                            },
                            {
                                key: "disableEventListeners",
                                value: function () {
                                    return U.call(this);
                                },
                            },
                        ]),
                        t
                        );
            })();
    return (
            (ue.Utils = ("undefined" == typeof window ? global : window).PopperUtils),
            (ue.placements = he),
            (ue.Defaults = {
                placement: "bottom",
                positionFixed: !1,
                eventsEnabled: !0,
                removeOnDestroy: !1,
                onCreate: function () {},
                onUpdate: function () {},
                modifiers: {
                    shift: {
                        order: 100,
                        enabled: !0,
                        fn: function (e) {
                            var t = e.placement,
                                    o = t.split("-")[0],
                                    n = t.split("-")[1];
                            if (n) {
                                var i = e.offsets,
                                        r = i.reference,
                                        p = i.popper,
                                        s = -1 !== ["bottom", "top"].indexOf(o),
                                        d = s ? "left" : "top",
                                        a = s ? "width" : "height",
                                        l = {
                                            start: le({}, d, r[d]),
                                            end: le({}, d, r[d] + r[a] - p[a]),
                                        };
                                e.offsets.popper = fe({}, p, l[n]);
                            }
                            return e;
                        },
                    },
                    offset: {order: 200, enabled: !0, fn: J, offset: 0},
                    preventOverflow: {
                        order: 300,
                        enabled: !0,
                        fn: function (e, t) {
                            var o = t.boundariesElement || p(e.instance.popper);
                            e.instance.reference === o && (o = p(o));
                            var n = H("transform"),
                                    i = e.instance.popper.style,
                                    r = i.top,
                                    s = i.left,
                                    d = i[n];
                            (i.top = ""), (i.left = ""), (i[n] = "");
                            var a = v(
                                    e.instance.popper,
                                    e.instance.reference,
                                    t.padding,
                                    o,
                                    e.positionFixed
                                    );
                            (i.top = r), (i.left = s), (i[n] = d), (t.boundaries = a);
                            var l = t.priority,
                                    f = e.offsets.popper,
                                    m = {
                                        primary: function (e) {
                                            var o = f[e];
                                            return (
                                                    f[e] < a[e] &&
                                                    !t.escapeWithReference &&
                                                    (o = ee(f[e], a[e])),
                                                    le({}, e, o)
                                                    );
                                        },
                                        secondary: function (e) {
                                            var o = "right" === e ? "left" : "top",
                                                    n = f[o];
                                            return (
                                                    f[e] > a[e] &&
                                                    !t.escapeWithReference &&
                                                    (n = Q(
                                                            f[o],
                                                            a[e] - ("right" === e ? f.width : f.height)
                                                            )),
                                                    le({}, o, n)
                                                    );
                                        },
                                    };
                            return (
                                    l.forEach(function (e) {
                                        var t =
                                                -1 === ["left", "top"].indexOf(e) ? "secondary" : "primary";
                                        f = fe({}, f, m[t](e));
                                    }),
                                    (e.offsets.popper = f),
                                    e
                                    );
                        },
                        priority: ["left", "right", "top", "bottom"],
                        padding: 5,
                        boundariesElement: "scrollParent",
                    },
                    keepTogether: {
                        order: 400,
                        enabled: !0,
                        fn: function (e) {
                            var t = e.offsets,
                                    o = t.popper,
                                    n = t.reference,
                                    i = e.placement.split("-")[0],
                                    r = Z,
                                    p = -1 !== ["top", "bottom"].indexOf(i),
                                    s = p ? "right" : "bottom",
                                    d = p ? "left" : "top",
                                    a = p ? "width" : "height";
                            return (
                                    o[s] < r(n[d]) && (e.offsets.popper[d] = r(n[d]) - o[a]),
                                    o[d] > r(n[s]) && (e.offsets.popper[d] = r(n[s])),
                                    e
                                    );
                        },
                    },
                    arrow: {
                        order: 500,
                        enabled: !0,
                        fn: function (e, o) {
                            var n;
                            if (!K(e.instance.modifiers, "arrow", "keepTogether"))
                                return e;
                            var i = o.element;
                            if ("string" == typeof i) {
                                if (((i = e.instance.popper.querySelector(i)), !i))
                                    return e;
                            } else if (!e.instance.popper.contains(i))
                                return (
                                        console.warn(
                                                "WARNING: `arrow.element` must be child of its popper element!"
                                                ),
                                        e
                                        );
                            var r = e.placement.split("-")[0],
                                    p = e.offsets,
                                    s = p.popper,
                                    d = p.reference,
                                    a = -1 !== ["left", "right"].indexOf(r),
                                    l = a ? "height" : "width",
                                    f = a ? "Top" : "Left",
                                    m = f.toLowerCase(),
                                    h = a ? "left" : "top",
                                    c = a ? "bottom" : "right",
                                    u = S(i)[l];
                            d[c] - u < s[m] && (e.offsets.popper[m] -= s[m] - (d[c] - u)),
                                    d[m] + u > s[c] && (e.offsets.popper[m] += d[m] + u - s[c]),
                                    (e.offsets.popper = g(e.offsets.popper));
                            var b = d[m] + d[l] / 2 - u / 2,
                                    w = t(e.instance.popper),
                                    y = parseFloat(w["margin" + f], 10),
                                    E = parseFloat(w["border" + f + "Width"], 10),
                                    v = b - e.offsets.popper[m] - y - E;
                            return (
                                    (v = ee(Q(s[l] - u, v), 0)),
                                    (e.arrowElement = i),
                                    (e.offsets.arrow = ((n = {}), le(n, m, $(v)), le(n, h, ""), n)),
                                    e
                                    );
                        },
                        element: "[x-arrow]",
                    },
                    flip: {
                        order: 600,
                        enabled: !0,
                        fn: function (e, t) {
                            if (W(e.instance.modifiers, "inner"))
                                return e;
                            if (e.flipped && e.placement === e.originalPlacement)
                                return e;
                            var o = v(
                                    e.instance.popper,
                                    e.instance.reference,
                                    t.padding,
                                    t.boundariesElement,
                                    e.positionFixed
                                    ),
                                    n = e.placement.split("-")[0],
                                    i = T(n),
                                    r = e.placement.split("-")[1] || "",
                                    p = [];
                            switch (t.behavior) {
                                case ge.FLIP:
                                    p = [n, i];
                                    break;
                                case ge.CLOCKWISE:
                                    p = G(n);
                                    break;
                                case ge.COUNTERCLOCKWISE:
                                    p = G(n, !0);
                                    break;
                                default:
                                    p = t.behavior;
                            }
                            return (
                                    p.forEach(function (s, d) {
                                        if (n !== s || p.length === d + 1)
                                            return e;
                                        (n = e.placement.split("-")[0]), (i = T(n));
                                        var a = e.offsets.popper,
                                                l = e.offsets.reference,
                                                f = Z,
                                                m =
                                                ("left" === n && f(a.right) > f(l.left)) ||
                                                ("right" === n && f(a.left) < f(l.right)) ||
                                                ("top" === n && f(a.bottom) > f(l.top)) ||
                                                ("bottom" === n && f(a.top) < f(l.bottom)),
                                                h = f(a.left) < f(o.left),
                                                c = f(a.right) > f(o.right),
                                                g = f(a.top) < f(o.top),
                                                u = f(a.bottom) > f(o.bottom),
                                                b =
                                                ("left" === n && h) ||
                                                ("right" === n && c) ||
                                                ("top" === n && g) ||
                                                ("bottom" === n && u),
                                                w = -1 !== ["top", "bottom"].indexOf(n),
                                                y =
                                                !!t.flipVariations &&
                                                ((w && "start" === r && h) ||
                                                        (w && "end" === r && c) ||
                                                        (!w && "start" === r && g) ||
                                                        (!w && "end" === r && u));
                                        (m || b || y) &&
                                                ((e.flipped = !0),
                                                        (m || b) && (n = p[d + 1]),
                                                        y && (r = z(r)),
                                                        (e.placement = n + (r ? "-" + r : "")),
                                                        (e.offsets.popper = fe(
                                                                {},
                                                                e.offsets.popper,
                                                                D(e.instance.popper, e.offsets.reference, e.placement)
                                                                )),
                                                        (e = P(e.instance.modifiers, e, "flip")));
                                    }),
                                    e
                                    );
                        },
                        behavior: "flip",
                        padding: 5,
                        boundariesElement: "viewport",
                    },
                    inner: {
                        order: 700,
                        enabled: !1,
                        fn: function (e) {
                            var t = e.placement,
                                    o = t.split("-")[0],
                                    n = e.offsets,
                                    i = n.popper,
                                    r = n.reference,
                                    p = -1 !== ["left", "right"].indexOf(o),
                                    s = -1 === ["top", "left"].indexOf(o);
                            return (
                                    (i[p ? "left" : "top"] =
                                            r[o] - (s ? i[p ? "width" : "height"] : 0)),
                                    (e.placement = T(t)),
                                    (e.offsets.popper = g(i)),
                                    e
                                    );
                        },
                    },
                    hide: {
                        order: 800,
                        enabled: !0,
                        fn: function (e) {
                            if (!K(e.instance.modifiers, "hide", "preventOverflow"))
                                return e;
                            var t = e.offsets.reference,
                                    o = C(e.instance.modifiers, function (e) {
                                        return "preventOverflow" === e.name;
                                    }).boundaries;
                            if (
                                    t.bottom < o.top ||
                                    t.left > o.right ||
                                    t.top > o.bottom ||
                                    t.right < o.left
                                    ) {
                                if (!0 === e.hide)
                                    return e;
                                (e.hide = !0), (e.attributes["x-out-of-boundaries"] = "");
                            } else {
                                if (!1 === e.hide)
                                    return e;
                                (e.hide = !1), (e.attributes["x-out-of-boundaries"] = !1);
                            }
                            return e;
                        },
                    },
                    computeStyle: {
                        order: 850,
                        enabled: !0,
                        fn: function (e, t) {
                            var o = t.x,
                                    n = t.y,
                                    i = e.offsets.popper,
                                    r = C(e.instance.modifiers, function (e) {
                                        return "applyStyle" === e.name;
                                    }).gpuAcceleration;
                            void 0 !== r &&
                                    console.warn(
                                            "WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!"
                                            );
                            var s,
                                    d,
                                    a = void 0 === r ? t.gpuAcceleration : r,
                                    l = p(e.instance.popper),
                                    f = u(l),
                                    m = {position: i.position},
                                    h = q(e, 2 > window.devicePixelRatio || !me),
                                    c = "bottom" === o ? "top" : "bottom",
                                    g = "right" === n ? "left" : "right",
                                    b = H("transform");
                            if (
                                    ((d =
                                            "bottom" == c
                                            ? "HTML" === l.nodeName
                                            ? -l.clientHeight + h.bottom
                                            : -f.height + h.bottom
                                            : h.top),
                                            (s =
                                                    "right" == g
                                                    ? "HTML" === l.nodeName
                                                    ? -l.clientWidth + h.right
                                                    : -f.width + h.right
                                                    : h.left),
                                            a && b)
                                    )
                                (m[b] = "translate3d(" + s + "px, " + d + "px, 0)"),
                                        (m[c] = 0),
                                        (m[g] = 0),
                                        (m.willChange = "transform");
                            else {
                                var w = "bottom" == c ? -1 : 1,
                                        y = "right" == g ? -1 : 1;
                                (m[c] = d * w), (m[g] = s * y), (m.willChange = c + ", " + g);
                            }
                            var E = {"x-placement": e.placement};
                            return (
                                    (e.attributes = fe({}, E, e.attributes)),
                                    (e.styles = fe({}, m, e.styles)),
                                    (e.arrowStyles = fe({}, e.offsets.arrow, e.arrowStyles)),
                                    e
                                    );
                        },
                        gpuAcceleration: !0,
                        x: "bottom",
                        y: "right",
                    },
                    applyStyle: {
                        order: 900,
                        enabled: !0,
                        fn: function (e) {
                            return (
                                    j(e.instance.popper, e.styles),
                                    V(e.instance.popper, e.attributes),
                                    e.arrowElement &&
                                    Object.keys(e.arrowStyles).length &&
                                    j(e.arrowElement, e.arrowStyles),
                                    e
                                    );
                        },
                        onLoad: function (e, t, o, n, i) {
                            var r = L(i, t, e, o.positionFixed),
                                    p = O(
                                            o.placement,
                                            r,
                                            t,
                                            e,
                                            o.modifiers.flip.boundariesElement,
                                            o.modifiers.flip.padding
                                            );
                            return (
                                    t.setAttribute("x-placement", p),
                                    j(t, {position: o.positionFixed ? "fixed" : "absolute"}),
                                    o
                                    );
                        },
                        gpuAcceleration: void 0,
                    },
                },
            }),
            ue
            );
});
//# sourceMappingURL=popper.min.js.map
