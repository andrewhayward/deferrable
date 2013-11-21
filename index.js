const Deferred = require('./lib/deferred');

exports = module.exports = function deferrable (fn, proto) {
  var len = fn.length;
  var wrapper = function () {
    var args = Array.prototype.slice.call(arguments);
    var proxy = null;

    if (args.length === len - 1) {
      proxy = new Deferred(proto);
      args.push(proxy._done);
    }

    fn.apply(this, args);
    return proxy;
  }
  wrapper.deferrable = proto;
  return wrapper;
}
