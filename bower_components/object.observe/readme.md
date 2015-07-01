Object.observe polyfill
=======================

`Object.observe` polyfill based on [EcmaScript 7 spec](http://arv.github.io/ecmascript-object-observe/). Read the [documentation](doc/index.md) for more detailed informations. Check the [changelog](changelog.md) to see what's changed.

## Installation

This polyfill extends the native `Object` and doesn't have any dependencies, so loading it is pretty straightforward:

```html
<script src="object-observe.js"></script>
```

Using bower:

```bash
$ bower install object.observe
```

Or in node.js:

```bash
$ npm install object.observe
```

That's it. If the environment doesn't already support `Object.observe`, the shim is installed and ready to use.

For client side usage, if you only need the "light" version of the polyfill (see the [documentation](doc/index.md)), replace `object-observe.js` with `object-observe-lite.js`. You can also use the minified versions of the same files (replacing `.js` with `.min.js`). If you want to use the "light" version on the server side, you can either directly reference the desired version with `require` (as in `require("./node_modules/object.observe/dist/object-observe-lite.js");`) or change the `"main"` reference in [`package.json`](package.json).

## Limitations and caveats

* Because properties are polled, when more than one change is made synchronously to the same property, it won't get caught. This means that this won't notify any event:

  ```js
  var object = { foo: null };
  Object.observe(object, function(changes) {
      console.log("Changes: ", changes);
  });
  
  object.foo = "bar";
  object.foo = null;
  ```
  
  `Object.prototype.watch` could help in this case, but it would be a partial solution.

* Property changes may not be reported in the correct order. The polyfill performs the checks - and issues the notifications - in this order:

  1. `"add"` and `"update"`, or `"reconfigure"`
  2. `"delete"` or `"reconfigure"`
  3. `"preventExtensions"`
  4. `"setPrototype"`
  
  This means that the `"add"` change is listed *before* the `"delete"` in the following snippet:
  
  ```js
  var obj = { foo: "bar" };
  Object.observe(foo, ...);
  delete obj.foo;
  obj.bar = "foo";
  ```
  
  Due to the nature of the shim, there's nothing that can be done about it.

* Environments that don't support [`Object.getOwnPropertyNames`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames) (most notably, Internet Explorer prior to version 9) can't detect changes to non-enumerable properties:

  ```js
  var re = /some regex/g;
  Object.observe(re, ...);
  
  re.lastIndex = 10;
  // Nothing happens...
  ```
  
  There's no way to prevent this limitation. Developers that need to support those environments should be careful about observing non-plain objects. A special polyfill is provided for arrays and the `length` property.

* Although the polyfill can work on DOM nodes or other *host* objects, the results may be impredictable. Moreover, in older environments like IE8-, observing nodes can be a cumbersome and memory hogging operation: they have a lot of enumerable properties that `Object.observe` should *not* check. Just don't observe nodes: it's not the point of `Object.observe`.

* **Possible memory leaks**: remember to `unobserve` the objects you want to be garbage collected. This can be avoided with native implementations of `Object.observe`, but due to the fact that in this polyfill observed objects are held in internal [maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), they can't be GC'ed until they're unobserved. ([`WeakMap`s](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) could solve this particular issue, but of course they're not for every environment - a shim for `Map` is used when not supported - and it's also not possible to iterate through their entries.)

* Dirty checking can be intensive. Memory occupation can grow to undesirable levels, not to mention CPU load. Pay attention to the number of objects your application needs to observe, and consider whether a polyfill is actually good for you.

## Browser support

This polyfill has been tested (and is working) in the following environments:

* Firefox 35-36 stable and 37-38 Developer Edition
* Internet Explorer 11
* Internet Explorer 5, 7, 8, 9, 10 (as IE11 in emulation mode)
* node.js 0.10.33-36

It also does *not* overwrite the native implentation in Chrome 36+, Opera 23+, node.js 0.11.13+ and io.js.

## License

The MIT License (MIT)

Copyright (c) 2015 Massimo Artizzu (MaxArt2501)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
