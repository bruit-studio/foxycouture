import passive from './polyfills-passive.bundle.js';
import { g as getDefaultExportFromCjs } from './shared-import-_commonjsHelpers.bundle.js';

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
var freeGlobal$1 = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal$1 || freeSelf || Function('return this')();
var root$1 = root;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function () {
  return root$1.Date.now();
};
var now$1 = now;

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;
  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '') : string;
}

/** Built-in value references. */
var Symbol = root$1.Symbol;
var Symbol$1 = Symbol;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
    tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]',
  undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
}

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

/** Error message constants. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
  nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
    lastThis,
    maxWait,
    result,
    timerId,
    lastCallTime,
    lastInvokeTime = 0,
    leading = false,
    maxing = false,
    trailing = true;
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    var args = lastArgs,
      thisArg = lastThis;
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime,
      timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time = now$1();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }
  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }
  function flush() {
    return timerId === undefined ? result : trailingEdge(now$1());
  }
  function debounced() {
    var time = now$1(),
      isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
    trailing = true;
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}
var smoothscroll$1 = {
  exports: {}
};

/* smoothscroll v0.4.4 - 2019 - Dustan Kasten, Jeremias Menichelli - MIT License */

(function (module, exports) {
  (function () {
    // polyfill
    function polyfill() {
      // aliases
      var w = window;
      var d = document;

      // return if scroll behavior is supported and polyfill is not forced
      if ('scrollBehavior' in d.documentElement.style && w.__forceSmoothScrollPolyfill__ !== true) {
        return;
      }

      // globals
      var Element = w.HTMLElement || w.Element;
      var SCROLL_TIME = 468;

      // object gathering original scroll methods
      var original = {
        scroll: w.scroll || w.scrollTo,
        scrollBy: w.scrollBy,
        elementScroll: Element.prototype.scroll || scrollElement,
        scrollIntoView: Element.prototype.scrollIntoView
      };

      // define timing method
      var now = w.performance && w.performance.now ? w.performance.now.bind(w.performance) : Date.now;

      /**
       * indicates if a the current browser is made by Microsoft
       * @method isMicrosoftBrowser
       * @param {String} userAgent
       * @returns {Boolean}
       */
      function isMicrosoftBrowser(userAgent) {
        var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];
        return new RegExp(userAgentPatterns.join('|')).test(userAgent);
      }

      /*
       * IE has rounding bug rounding down clientHeight and clientWidth and
       * rounding up scrollHeight and scrollWidth causing false positives
       * on hasScrollableSpace
       */
      var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;

      /**
       * changes scroll position inside an element
       * @method scrollElement
       * @param {Number} x
       * @param {Number} y
       * @returns {undefined}
       */
      function scrollElement(x, y) {
        this.scrollLeft = x;
        this.scrollTop = y;
      }

      /**
       * returns result of applying ease math function to a number
       * @method ease
       * @param {Number} k
       * @returns {Number}
       */
      function ease(k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
      }

      /**
       * indicates if a smooth behavior should be applied
       * @method shouldBailOut
       * @param {Number|Object} firstArg
       * @returns {Boolean}
       */
      function shouldBailOut(firstArg) {
        if (firstArg === null || typeof firstArg !== 'object' || firstArg.behavior === undefined || firstArg.behavior === 'auto' || firstArg.behavior === 'instant') {
          // first argument is not an object/null
          // or behavior is auto, instant or undefined
          return true;
        }
        if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
          // first argument is an object and behavior is smooth
          return false;
        }

        // throw error when behavior is not supported
        throw new TypeError('behavior member of ScrollOptions ' + firstArg.behavior + ' is not a valid value for enumeration ScrollBehavior.');
      }

      /**
       * indicates if an element has scrollable space in the provided axis
       * @method hasScrollableSpace
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */
      function hasScrollableSpace(el, axis) {
        if (axis === 'Y') {
          return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
        }
        if (axis === 'X') {
          return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
        }
      }

      /**
       * indicates if an element has a scrollable overflow property in the axis
       * @method canOverflow
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */
      function canOverflow(el, axis) {
        var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];
        return overflowValue === 'auto' || overflowValue === 'scroll';
      }

      /**
       * indicates if an element can be scrolled in either axis
       * @method isScrollable
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */
      function isScrollable(el) {
        var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
        var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');
        return isScrollableY || isScrollableX;
      }

      /**
       * finds scrollable parent of an element
       * @method findScrollableParent
       * @param {Node} el
       * @returns {Node} el
       */
      function findScrollableParent(el) {
        while (el !== d.body && isScrollable(el) === false) {
          el = el.parentNode || el.host;
        }
        return el;
      }

      /**
       * self invoked function that, given a context, steps through scrolling
       * @method step
       * @param {Object} context
       * @returns {undefined}
       */
      function step(context) {
        var time = now();
        var value;
        var currentX;
        var currentY;
        var elapsed = (time - context.startTime) / SCROLL_TIME;

        // avoid elapsed times higher than one
        elapsed = elapsed > 1 ? 1 : elapsed;

        // apply easing to elapsed time
        value = ease(elapsed);
        currentX = context.startX + (context.x - context.startX) * value;
        currentY = context.startY + (context.y - context.startY) * value;
        context.method.call(context.scrollable, currentX, currentY);

        // scroll more if we have not reached our destination
        if (currentX !== context.x || currentY !== context.y) {
          w.requestAnimationFrame(step.bind(w, context));
        }
      }

      /**
       * scrolls window or element with a smooth behavior
       * @method smoothScroll
       * @param {Object|Node} el
       * @param {Number} x
       * @param {Number} y
       * @returns {undefined}
       */
      function smoothScroll(el, x, y) {
        var scrollable;
        var startX;
        var startY;
        var method;
        var startTime = now();

        // define scroll context
        if (el === d.body) {
          scrollable = w;
          startX = w.scrollX || w.pageXOffset;
          startY = w.scrollY || w.pageYOffset;
          method = original.scroll;
        } else {
          scrollable = el;
          startX = el.scrollLeft;
          startY = el.scrollTop;
          method = scrollElement;
        }

        // scroll looping over a frame
        step({
          scrollable: scrollable,
          method: method,
          startTime: startTime,
          startX: startX,
          startY: startY,
          x: x,
          y: y
        });
      }

      // ORIGINAL METHODS OVERRIDES
      // w.scroll and w.scrollTo
      w.scroll = w.scrollTo = function () {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.scroll.call(w, arguments[0].left !== undefined ? arguments[0].left : typeof arguments[0] !== 'object' ? arguments[0] : w.scrollX || w.pageXOffset,
          // use top prop, second argument if present or fallback to scrollY
          arguments[0].top !== undefined ? arguments[0].top : arguments[1] !== undefined ? arguments[1] : w.scrollY || w.pageYOffset);
          return;
        }

        // LET THE SMOOTHNESS BEGIN!
        smoothScroll.call(w, d.body, arguments[0].left !== undefined ? ~~arguments[0].left : w.scrollX || w.pageXOffset, arguments[0].top !== undefined ? ~~arguments[0].top : w.scrollY || w.pageYOffset);
      };

      // w.scrollBy
      w.scrollBy = function () {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0])) {
          original.scrollBy.call(w, arguments[0].left !== undefined ? arguments[0].left : typeof arguments[0] !== 'object' ? arguments[0] : 0, arguments[0].top !== undefined ? arguments[0].top : arguments[1] !== undefined ? arguments[1] : 0);
          return;
        }

        // LET THE SMOOTHNESS BEGIN!
        smoothScroll.call(w, d.body, ~~arguments[0].left + (w.scrollX || w.pageXOffset), ~~arguments[0].top + (w.scrollY || w.pageYOffset));
      };

      // Element.prototype.scroll and Element.prototype.scrollTo
      Element.prototype.scroll = Element.prototype.scrollTo = function () {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          // if one number is passed, throw error to match Firefox implementation
          if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
            throw new SyntaxError('Value could not be converted');
          }
          original.elementScroll.call(this,
          // use left prop, first number argument or fallback to scrollLeft
          arguments[0].left !== undefined ? ~~arguments[0].left : typeof arguments[0] !== 'object' ? ~~arguments[0] : this.scrollLeft,
          // use top prop, second argument or fallback to scrollTop
          arguments[0].top !== undefined ? ~~arguments[0].top : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop);
          return;
        }
        var left = arguments[0].left;
        var top = arguments[0].top;

        // LET THE SMOOTHNESS BEGIN!
        smoothScroll.call(this, this, typeof left === 'undefined' ? this.scrollLeft : ~~left, typeof top === 'undefined' ? this.scrollTop : ~~top);
      };

      // Element.prototype.scrollBy
      Element.prototype.scrollBy = function () {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.elementScroll.call(this, arguments[0].left !== undefined ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft, arguments[0].top !== undefined ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop);
          return;
        }
        this.scroll({
          left: ~~arguments[0].left + this.scrollLeft,
          top: ~~arguments[0].top + this.scrollTop,
          behavior: arguments[0].behavior
        });
      };

      // Element.prototype.scrollIntoView
      Element.prototype.scrollIntoView = function () {
        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.scrollIntoView.call(this, arguments[0] === undefined ? true : arguments[0]);
          return;
        }

        // LET THE SMOOTHNESS BEGIN!
        var scrollableParent = findScrollableParent(this);
        var parentRects = scrollableParent.getBoundingClientRect();
        var clientRects = this.getBoundingClientRect();
        if (scrollableParent !== d.body) {
          // reveal element inside parent
          smoothScroll.call(this, scrollableParent, scrollableParent.scrollLeft + clientRects.left - parentRects.left, scrollableParent.scrollTop + clientRects.top - parentRects.top);

          // reveal parent in viewport unless is fixed
          if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
            w.scrollBy({
              left: parentRects.left,
              top: parentRects.top,
              behavior: 'smooth'
            });
          }
        } else {
          // reveal element in viewport
          w.scrollBy({
            left: clientRects.left,
            top: clientRects.top,
            behavior: 'smooth'
          });
        }
      };
    }
    {
      // commonjs
      module.exports = {
        polyfill: polyfill
      };
    }
  })();
})(smoothscroll$1);
var smoothscrollExports = smoothscroll$1.exports;
var smoothscroll = /*@__PURE__*/getDefaultExportFromCjs(smoothscrollExports);
document.addEventListener('alpine:init', () => {
  Alpine.store('theme-editor', {
    selected_section: null,
    selected_block: null,
    init() {
      document.addEventListener('shopify:section:select', e => {
        this.selected_section = e.detail;
      });
      document.addEventListener('shopify:section:deselect', () => {
        this.selected = null;
      });
      document.addEventListener('shopify:block:select', e => {
        this.selected_block = {
          target: e.target,
          detail: e.detail
        };
      });
      document.addEventListener('shopify:block:deselect', () => {
        this.selected_block = null;
      });
    }
  });
});
window['ThemeModule_Carousel'] = (section_id, autoplay_enabled = false, autoplay_seconds) => {
  return {
    section_id: section_id,
    track: null,
    track_container: null,
    total_slides: 0,
    current_slide: 1,
    slides: [],
    track_left: 0,
    transition: false,
    isMouseDown: false,
    scroll_left: 0,
    start_x: 0,
    has_thumbnails: false,
    thumbnail_track: false,
    theme_editor_start_index: null,
    autoplay_interval: null,
    autoplay_enabled: autoplay_enabled,
    is_auto_playing: false,
    manually_paused: false,
    is_mouse_over: false,
    is_focused: false,
    current_block: null,
    autoplay_seconds: autoplay_seconds,
    mounted() {
      if (Shopify.designMode) {
        this._setUpDesignModeHandlers();
        this.current_block = this.$store['theme-editor'].selected_block;
        if (this.$store['theme-editor'].selected_block) {
          this._setIndexFromThemeEditorEvent(this.$store['theme-editor'].selected_block.target, this.$store['theme-editor'].selected_block.detail);
        }
      }
      smoothscroll.polyfill();
      this.track = this.$refs['carousel-track'];
      this.track_container = this.$refs['carousel-track-container'];
      this.track_left = this.track.getBoundingClientRect().left;
      if (this.$refs['carousel-thumbnails']) {
        this.has_thumbnails = true;
      }
      if (this.$refs['thumbnail-track']) {
        this.thumbnail_track = true;
      }
      const throttleHandler = () => {
        this.scrollListener();
      };
      const debounceHandler = () => {
        this.scrollEndListener();
      };

      //make throttle handler an arrow function
      this.track.addEventListener('scroll', throttleHandler, passive);
      this.track.addEventListener('scroll', debounceHandler, passive);
      //track.addEventListener('scroll', this.scrollEndListener, passive);

      let items = Array.prototype.slice.call(this.track.children);
      for (let i = 0; i < items.length; i++) {
        //get the .tile-link element from each slide

        const links = items[i].getElementsByTagName('a');
        const buttons = items[i].getElementsByTagName('button');
        const images = items[i].getElementsByTagName('img');
        this.slides.push({
          visible: false,
          tabindex: 0,
          elem: items[i],
          links: [].slice.call(links),
          buttons: [].slice.call(buttons),
          images: [].slice.call(images)
        });
      }
      this.total_slides = this.slides.length;
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const index = [].indexOf.call(entry.target.parentElement.children, entry.target);

          //set tab index on links and buttons if they exist
          this.slides[index].links.forEach(link => {
            link.tabIndex = entry.intersectionRatio === 1 ? 0 : -1;
          });
          this.slides[index].buttons.forEach(button => {
            button.tabIndex = entry.intersectionRatio === 1 ? 0 : -1;
          });
          if (entry.intersectionRatio > 0 && entry.boundingClientRect.x > 0) {
            let nextSlideIndex = index + 1;
            //set attribute if nextSlideIndex is not higher than total_slides
            if (nextSlideIndex < this.total_slides) {
              //loop through images and set attribute to eager
              this.slides[index + 1].images.forEach(image => {
                image.setAttribute('loading', 'eager');
              });
            }
          }
        });
      }, {
        root: this.$el,
        rootMargin: '9999px 0px 9999px 0px',
        threshold: [0, 1]
      });

      //observe each slide
      for (let i = 0; i < this.slides.length; i++) {
        this.observer.observe(this.slides[i].elem);
      }
      this.$watch('current_slide', (value, oldValue) => {
        //get data-product-single-media-wrapper of old slide
        let old_media = this.slides[oldValue - 1].elem.querySelector('[data-product-single-media-wrapper]');
        let new_media = this.slides[value - 1].elem.querySelector('[data-product-single-media-wrapper]');
        if (!new_media) return;
        old_media.dispatchEvent(new CustomEvent('mediaHidden'));
        new_media.dispatchEvent(new CustomEvent('mediaVisible'));
      });

      //check if this is a child of a product page, element with attribute data-product-section
      if (this.$el.closest('[data-product-section]')) {
        if (this.current_media_id) {
          this.mediaChange();
        }
        this.$watch('current_media_id', () => {
          this.mediaChange();
        });
      }
      this.setSlideMediaToEager(this.slides[1]);
      if (this.autoplay_enabled) {
        this.autoPlayInit();
      }
      if (Shopify.designMode) {
        this._setUpDesignModeHandlers();
      }
    },
    mediaChange() {
      let new_media_id = this.current_media_id.toString();
      //get index of slide with 'data-media-id' attribute equal to new_media_id
      let new_slide_index = this.slides.findIndex(slide => {
        return slide.elem.dataset.mediaId === new_media_id;
      });
      if (new_slide_index === -1) {
        return;
      }
      this.current_slide = new_slide_index + 1;
      this.slideIntoView(this.slides[new_slide_index]);
    },
    getClosestSlide() {
      return this.slides.reduce((closest, slide, index) => {
        const slideLeft = slide.elem.getBoundingClientRect().left;
        const diff = Math.abs(this.track_left - slideLeft);
        if (!closest) {
          return {
            index: index,
            slide: slide,
            diff: diff
          };
        }
        if (diff <= closest.diff) {
          return {
            index: index,
            slide: slide,
            diff: diff
          };
        }
        return closest;
      }, false);
    },
    scrollEndListener: debounce(function () {
      if (this.transition) {
        this.transition = false;
      }
    }, 250),
    scrollListener: throttle(function () {
      if (!this.transition) {
        const closestSlide = this.getClosestSlide();
        this.current_slide = closestSlide.index + 1;
      }
    }, 250),
    prevSlide() {
      this.transition = true;
      if (this.current_slide <= 1) {
        this.current_slide = this.total_slides;
      } else {
        this.current_slide--;
      }
      this.$nextTick(() => {
        this.slideIntoView(this.slides[this.current_slide - 1]);
      });
    },
    nextSlide() {
      this.transition = true;
      if (this.current_slide >= this.total_slides) {
        this.current_slide = 1;
      } else {
        this.current_slide++;
      }
      this.$nextTick(() => {
        this.slideIntoView(this.slides[this.current_slide - 1]);
        this.setSlideMediaToEager(this.slides[this.current_slide]);
      });
    },
    slideIntoView(slide) {
      if (!this.$refs['carousel-track']) return;
      this.$refs['carousel-track'].scrollTo({
        left: slide.elem.offsetLeft,
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });

      //if thumbnail track is visible, scroll current thumbnail into view
      this.$nextTick(() => {
        if (this.thumbnail_track) {
          //get thumbnail list item with "is-active" class
          const activeThumbnail = this.$refs['carousel-thumbnails'].querySelector('.is-active');

          //using scrollTo, bring active thumbnail into view, center of thumbnail track
          this.$refs['thumbnail-track'].scrollTo({
            left: activeThumbnail.offsetLeft - this.$refs['carousel-thumbnails'].offsetWidth / 2 + activeThumbnail.offsetWidth / 2,
            behavior: 'smooth'
          });
        }
      });
    },
    thumbnailFocus(index) {
      this.transition = true;
      this.current_slide = index + 1;
      this.slideIntoView(this.slides[index]);
    },
    thumbnailKeyPress(direction) {
      let newSlide;
      if (direction === 'left') {
        //set focus to previous button, or last button if first button is focused
        if (this.current_slide === 1) {
          newSlide = this.total_slides;
        } else {
          newSlide = this.current_slide - 1;
        }
      } else {
        //set focus to next button, or first button if last button is focused
        if (this.current_slide === this.total_slides) {
          newSlide = 1;
        } else {
          newSlide = this.current_slide + 1;
        }
      }

      //find button with matching index
      const button = this.$refs['carousel-thumbnails'].querySelector(`[data-slide="${newSlide}"]`);
      button.focus();
    },
    setSlideMediaToEager(slide) {
      if (slide !== undefined) {
        const media = slide.elem.querySelector('.tile-media');
        if (media) {
          media.setAttribute('loading', 'eager');
        }
      }
    },
    autoPlayInit() {
      this.startAutoPlay();
      this.$watch('is_mouse_over', newValue => {
        if (newValue) {
          this.stopAutoPlay();
        } else {
          this.startAutoPlay();
        }
      });
      this.$root.addEventListener('focusin', e => {
        this.has_focus = true;
        this.handleFocus();
      });
      this.$root.addEventListener('focusout', e => {
        this.has_focus = false;
        this.handleFocus();
      });
      if (Shopify.designMode) {
        Alpine.effect(() => {
          const block = Alpine.store('theme-editor').selected_block;
          if (block === null) {
            this.manually_paused = false;
            this.startAutoPlay();
          }
        });
      }
    },
    startAutoPlay() {
      this.is_auto_playing = true;
      if (this.autoplay_interval) return;
      //convert this.autoplay_seconds to milliseconds
      this.autoplay_interval = setInterval(() => {
        if (!this.manually_paused) {
          this.nextSlide();
        }
      }, this.autoplay_seconds * 1000);
    },
    stopAutoPlay() {
      this.is_auto_playing = false;
      clearInterval(this.autoplay_interval);
    },
    manualToggleAutoPlay() {
      this.manually_paused = !this.manually_paused;
      if (this.manually_paused) {
        this.stopAutoPlay();
      }
    },
    handleFocus: debounce(function () {
      if (this.has_focus) {
        this.stopAutoPlay();
      } else {
        this.stopAutoPlay();
      }
    }, 250),
    _setIndexFromThemeEditorEvent(target, detail) {
      let target_section_id = detail.sectionId;
      if (target_section_id === this.section_id) {
        const block = target;
        const slideIndex = Array.from(block.closest('.carousel-track').children).indexOf(block);
        this.current_slide = slideIndex + 1;
        this.theme_editor_start_index = slideIndex;
        this.$nextTick(() => {
          this.slideIntoView(this.slides[this.current_slide - 1]);
        });

        //if autoplay is enabled, stop autoplay and set paused manually to true
        if (this.autoplay_enabled) {
          this.manually_paused = true;
          this.stopAutoPlay();
        }
      }
    },
    _setUpDesignModeHandlers() {
      document.addEventListener('shopify:block:select', e => {
        this._setIndexFromThemeEditorEvent(e.target, e.detail);
      });
    }
  };
};
