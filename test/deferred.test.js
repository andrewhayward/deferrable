var test = require('tap').test;

test('Is `deferrable` callable?', function (t) {
  var deferrable = require('..');
  t.type(deferrable, 'function', '`deferrable` is callable');
  t.end();
});
