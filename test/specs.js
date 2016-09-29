/* global describe, it */

'use strict';

const chai = require('chai');

const forEachAsync = require('../for-each-async');

const expect = chai.expect;
const should = chai.should();

describe('forEachAsync', () => {

  describe('interface', () => {

    it('should throw if the first parameter is not an array', () => {
      expect(() => {
        forEachAsync(false);
      }).to.throw(TypeError, /must be called on an array/);
    });

    it('should throw if the second parameter is not a function', () => {
      expect(() => {
        forEachAsync([], false);
      }).to.throw(TypeError, /must be a function/);
    });

    it('should throw if the third parameter is not a function', () => {
      expect(() => {
        forEachAsync([], () => {}, false);
      }).to.throw(TypeError, /must be a function/);
    });
  });

  describe('iterator', () => {

    it('should wait until the current iteration invokes the "next" callback before iterating to the next step', done => {
      const _arr = ['foo', 'bar', 'baz'];
      const _delay = 250;
      const _startTime = new Date();

      forEachAsync(_arr, (val, n, arr, next) => {
        setTimeout(() => {
          const _stepTime = new Date();
          const _deltaTime = _stepTime - _startTime;

          expect(_deltaTime).to.be.at.least(_delay * (n + 1)).and.to.be.below(_delay * (n + 2));
          next();
        }, _delay);
      }, () => {
        done();
      });
    });

    it('should skip empty items in the array', done => {
      const _arr = ['foo', 'bar', , 'baz'];
      let _step = 0;

      forEachAsync(_arr, (val, n, arr, next) => {
        _step++;
        next();
      }, () => {
        expect(_step).to.equal(3);
        done();
      });
    });
  });

  describe('iteratee', () => {

    describe('val', () => {

      it('should be equal to the value currently being processed', done => {
        const _arr = ['foo', 'bar', 'baz'];
        let _step = 0;

        forEachAsync(_arr, (val, n, arr, next) => {
          expect(val).to.equal(_arr[_step++]);
          next();
        }, () => {
          done();
        });
      });
    });

    describe('n', () => {

      it('should start at 0', done => {
        const _arr = ['bar', 'baz'];
        let _step = 0;

        forEachAsync(_arr, (val, n, arr, next) => {
          expect(n).to.equal(_step++);
          next();
        }, () => {
          done();
        });
      });
    });

    describe('arr', () => {

      it('should be equal to the given array', done => {
        const _arr = ['foo', 'bar', 'baz'];

        forEachAsync(_arr, (val, n, arr, next) => {
          expect(arr).to.deep.equal(_arr);
          next();
        }, () => {
          done();
        });
      });
    });

    describe('scope', () => {

      it('should be equal to `null` if no `thisArg` is specified', done => {
        const _arr = ['foo', 'bar', 'baz'];

        forEachAsync(_arr, function (val, n, arr, next) {
          expect(this).to.be.null;
          next();
        }, () => {
          done();
        });
      });

      it('should be equal to the given scope if `thisArg` is specified', done => {
        const _arr = ['foo', 'bar', 'baz'];
        const _this = {};

        forEachAsync(_arr, function (val, n, arr, next) {
          expect(this).to.equal(_this);
          next();
        }, () => {
          done();
        }, _this);
      });
    });
  });

  describe('done', () => {

    it('should be called when the loop finishes', done => {
      const _arr = ['foo', 'bar', 'baz'];
      const _delay = 250;
      const _startTime = new Date();

      forEachAsync(_arr, (val, n, arr, next) => {
        setTimeout(() => next(), _delay);
      }, () => {
        const _endTime = new Date();
        const _deltaTime = _endTime - _startTime;

        expect(_deltaTime).to.be.above((_arr.length) * _delay).and.below((_arr.length + 1) * _delay);
        done();
      });
    });
  });
});
