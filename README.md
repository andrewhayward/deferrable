Deferrable
==========

**A system for abusing callbacks.**

Background
----------

An ordinary Node-style long-running function looks something like this:

```javascript
doSomethingLongRunning (..., cb) {
  ...
}
```

When that process is done, `cb` is fired off, with an `error` and a `data` parameter. However, this often means we end up with spaghetti code that looks something like this:

```javascript
Group.fromId(id, function (err, group) {
  if (err)
    return dealWithError(err);

  group.getOwner(function (err, user) {
    if (err)
      return dealWithError(err);

    user.getGroups(function (err, groups) {
      if (err)
        return dealWithError(err);

      // do something with the groups
    });
  })
});
```

It would be much nicer if we could get to that end goal without all the middle-men callbacks getting in the way, like this:

```javascript
Group.fromId(id).getOwner().getGroups(function (err, groups) {
  if (err)
    return dealWithError(err);

  // do something with the groups
});
```

Usage
-----

We can achieve this by marking our methods as `deferrable`, and providing a prototype for the expected return value:

```javascript
const deferrable = require('deferrable');

Group.fromId = deferrable(function(id, cb) {
  db.find(..., cb);
}, User.prototype);
```
