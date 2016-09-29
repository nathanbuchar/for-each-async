'use strict';

module.exports = function reduceAsync(arr, iteratee, done /*, thisArg*/) {

  /**
   * Validate that the first parameter is an array.
   *
   * @throws
   */
  if (!Array.isArray(arr)) {
    throw new TypeError(
      'Async reduce must be called on an array. Got "' + typeof array + '".');
  }

  /**
   * Validate that the second parameter is a function.
   *
   * @throws
   */
  if (typeof iteratee !== 'function') {
    throw new TypeError(
      '"iteratee" must be a function. Got "' + typeof iteratee + '"');
  }

  /**
   * Validate that the third parameter is a function.
   *
   * @throws
   */
  if (typeof done !== 'function') {
    throw new TypeError(
      '"done" must be a function. Got "' + typeof done + '"');
  }

  /**
   * The reduceAsync arguments.
   *
   * @type {Array}
   * @private
   */
  let _args = arguments;

  /**
   * The array to reduce.
   *
   * @type {Array}
   * @private
   */
  let _arr = Object(arr);

  /**
   * The zero-fill right shifted length of the array. Ensures that the length
   * of large arrays is always positive.
   *
   * @type {number}
   * @private
   */
  let _len = _arr.length >>> 0;

  /**
   * The starting index.
   *
   * @type {number}
   * @default 0
   * @private
   */
  let _index = 0;

  /**
   * The value to use as `this` when executing the callback.
   *
   * @type {Object}
   * @default null
   * @private
   */
  let _this = (function () {
    if (_args.length > 3) {
      return _args[3];
    } else {
      return null;
    }
  }());

  /**
   * The reduction iterator function. Called by the "_next" function to make
   * recusively iterative calls asynchronously.
   *
   * @param {number} n
   * @private
   */
  function _iterator(n) {
    if (n < _len) {
      if (n in _arr) {
        iteratee.call(_this, _arr[n], n, _arr, _next(n));
      } else {
        _iterator(++n);
      }
    } else {
      done();
    }
  }

  /**
   * The reduction "next" handler. Updates the value of the reduction and makes
   * another call to the iterator if the reduction is still in progress, or
   * calls the "done" callback if the reduction has finished.
   *
   * @param {number} n
   * @returns {Function}
   * @private
   */
  function _next(n) {
    return () => {
      _iterator(++n);
    };
  }

  _iterator(_index);
};
