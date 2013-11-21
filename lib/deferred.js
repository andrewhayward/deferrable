function Deferred (proto) {
  if (!(this instanceof Deferred))
    return new Deferred(proto);

  var deferred = this;
  var history = [];
  var done = false;
  var error = null;
  var binding = null;

  Object.getOwnPropertyNames(proto).forEach(function(key) {
    if (typeof proto[key] === 'function') {
      Object.defineProperty(deferred, key, {
        __proto__: null,
        enumerable: true,
        value: function () {
          var args = Array.prototype.slice.call(arguments);

          if (done) {
            if (error) {
              var cb = args.pop();
              args.push(cb);
              if (typeof cb === 'function')
                cb.call(deferred, error);
            } else if (binding) {
              binding[key].apply(binding, arguments);
            }
            return;
          }

          var response = null;

          if (proto[key].deferrable) {
            response = new Deferred(proto[key].deferrable);
            args.push(response._done);
          }

          history.push({
            method: key,
            args: args
          });

          return response;
        }
      });
    } else {
      Object.defineProperty(deferred, key, {
        __proto__: null,
        enumerable: true,
        get: function () {
          if (!binding)
            throw new ReferenceError('Deferred not yet bound');
          return binding[key];
        },
        set: function (value) {
          if (!binding)
            throw new ReferenceError('Deferred not yet bound');
          binding[key] = value;
        }
      })
    }
  });

  Object.defineProperty(deferred, '_done', {
    __proto__: null,
    value: function (err, rsp) {
      if (done)
        throw new Error('Deferred already complete');

      done = true;

      if (err) {
        error = err;
        history.forEach(function(item) {
          var cb = item.args.pop();
          item.args.push(cb);
          if (typeof cb === 'function')
            cb.call(deferred, err);
        });
      } else {
        binding = rsp;
        history.forEach(function(item) {
          rsp[item.method].apply(rsp, item.args);
        });
      }
    }
  });
}
