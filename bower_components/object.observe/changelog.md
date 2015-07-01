## v0.2.4

2015-03-31

* Code linting
* Fixes issue #4

## v0.2.3

2015-03-06

* Fix on observing arrays in IE8-
* Removed DOM node detection (just don't observe nodes)
* Throwing on non-object accept lists
* Small code changes
* Unbundled utils, set as dev dependencies
* Added source maps for the minified versions

## v0.2.2

2015-02-11

* Uses `Object.getOwnPropertyNames` instead of `Object.keys` (issue #1)
* Functions can now be observed
* More tests

## v0.2.1

2015-01-28

* Desynch event delivering on `Object.unobserve`
* Package restructuring, splitted documentation
* `npm` module (`object.observe`)
* `bower` module (`object.observe`)

## v0.2.0

2015-01-26

* Code refactoring for correct event grouping
* Checks performed on a global loop with `requestAnimationFrame` (or a polyfilled version)
* Unused code cleanup
* Added some [mocha](http://mochajs.org/) tests

## v0.1.2

2015-01-21

* Support for `"reconfigure"` and `"setPrototype"` events
* New "light" version of the polyfill
* Various bugfixes
* Fixed links for specs

## v0.1.1

2015-01-19

* Fixed bugs in `Object.unobserve`
* Fixed bugs in `notifier.performChange`
* Used `Map`s when available - *much* cleaner code!
* Added some code documentation

## v0.1.0

2015-01-18 - First preliminary version

* `Object.observe`, `Object.unobserve`
* `Object.getNotifier`, `Object.deliverChangeRecords`
* No support for `"reconfigure"` and `"setPrototype"` events
* No `Array.observe`/`unobserve` yet
