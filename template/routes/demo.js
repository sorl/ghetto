'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

exports.index = (function () {
  var ref = _asyncToGenerator(function* (req, res, next) {
    res.send('YOU ARE IN THE GHETTO NOW.');
  });

  return function (_x, _x2, _x3) {
    return ref.apply(this, arguments);
  };
})();

exports.sleep = (function () {
  var ref = _asyncToGenerator(function* (req, res, next) {
    yield require('sleep').sleep(1);
    res.send('DID YOU LIKE TO WAIT?');
  });

  return function (_x4, _x5, _x6) {
    return ref.apply(this, arguments);
  };
})();

exports.ohno = (function () {
  var ref = _asyncToGenerator(function* (req, res, next) {
    throw Error('OH NO!');
  });

  return function (_x7, _x8, _x9) {
    return ref.apply(this, arguments);
  };
})();

//# sourceMappingURL=demo.js.map