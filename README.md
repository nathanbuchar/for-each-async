ForEachAsync [![Build Status](https://travis-ci.org/nathanbuchar/for-each-async.svg?branch=master)](https://travis-ci.org/nathanbuchar/for-each-async)
===========

Asynchronous `Array.forEach`. The [`forEach()`][external_mdn_foreach] method executes a provided function once per array element.



***



### Installation

```bash
$ npm install foreach-async
```


### Syntax

```
forEachAsync(array, iteratee, done[, thisArg])
```

**Parameters**

* **`array`** *Array* - The array to iterate through.

* **`iteratee`** *Function* - The function to execute on each value in the array, taking four arguments:
  * `val` *Any* - The current element being processed in the array.

  * `n` *Integer* - The index of the current element being processed in the array.

  * `arr` *Array* - The array `forEachAsync` was called upon.

  * `next` *Function* - The function to call when you are ready to advance to the next element in the array.

* **`done`** *Function* - The function called when the loop has finished.

* **`thisArg`** *Object* (Optional) - Value to use as `this` when executing callback.

[More information][external_mdn_foreach] on how `forEach` works.


### Examples

* Asynchronously print the contents of an array.

  The following code logs a line for each element in an array:

  ```js
  function logArrayElements(val, n, arr, next) {
    console.log('a[' + n + '] = ' + val);
    next();
  }

  // Notice that index 2 is skipped since there is no item at
  // that position in the array.
  forEachAsync([2, 5, , 9], logArrayElements, () => {
    console.log('done');
  });
  // logs:
  // a[0] = 2
  // a[1] = 5
  // a[3] = 9
  // done
  ```

* Asynchronously using `thisArg`

  The following (contrived) example updates an object's properties from each entry in the array:

  ```js
  function Counter() {
    this.sum = 0;
    this.count = 0;
  }

  Counter.prototype.add = function (array) {
    forEachAsync(array, function (val, n, arr, next) {
      this.sum += entry;
      ++this.count;
      next();
    }, function () {
      // Done
    }, this);
    // ^---- Note
  };

  var obj = new Counter();
  obj.add([2, 5, 9]);
  obj.count
  // 3
  obj.sum
  // 16
  ```

  Since the `thisArg` parameter (`this`) is provided to `forEachAsync()`, it is passed to callback each time it's invoked, for use as its `this` value.



***



Authors
-------
* [Nathan Buchar]


License
-------
[ISC](./LICENSE)






[external_mdn_foreach]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

[Nathan Buchar]: mailto:hello@nathanbuchar.com
