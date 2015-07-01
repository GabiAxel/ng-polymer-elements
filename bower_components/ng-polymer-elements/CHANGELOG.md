# Changelog

## 0.3.0 - 2015-07-01
- Upgraded to Polymer 1.0
- Simplified mapping structure
- Dropped observe-js dependency in favor of native Object.observe()
- Reimplemented object and array observation for changes
- Use property-changed event for primitives and reference changes
- Added/updated built-in support for Iron, Paper, Gold and Google elements

## 0.2.0 - 2014-12-10
- Upgraded to Polymer 0.5.1
- Removed mapping for core-input, which now works out of the box
- Added mappings for core-selector, core-menu and paper-action-dialog
- Removed handling of automatic bootstrapping, which is not needed for bleeding edge browsers (Chrome and Opera)
- Changed extension point to use AngularJS constant instead of a global variable
