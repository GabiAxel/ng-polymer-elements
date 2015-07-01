/*!
 * ng-polymer-elements 0.3.0
 * https://gabiaxel.github.io/ng-polymer-elements/

 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
(function(angular) {

  angular.module('ng-polymer-elements', []).config(
    ['$compileProvider', '$injector', function($compileProvider, $injector) {

    'use strict';

    // Each mapping is an object where the key is the directive/custom element
    // name in camel case and the value is an object where the keys are the
    // AngularJS attributes in camel case and the values are objects where the
    // key is the type which can be 'primitive', 'object', 'array' or 'event'
    // and the value is the name of the attribute in the web component.

    var inputMappings = {
      ngModel: '=value',
      ngDisabled: '=disabled',
      ngFocused: '=focused'
    };

    var selectorMappings = {
      ngModel: '=selected'
    };

    var multiSelectableMappings = {
      ngModel: function property(element) {
        return element.hasAttribute('multi') ? 'selectedValues' : 'selected';
      }
    };

    var checkMappings = {
      ngModel: '=checked',
      ngDisabled: '=disabled',
      ngChange: '&iron-change'
    };

    var allMappings = {
      ironSelector: multiSelectableMappings,
      paperInput: inputMappings,
      paperTextArea: inputMappings,
      paperRadioGroup: selectorMappings,
      paperTabs: selectorMappings,
      paperMenu: multiSelectableMappings,
      paperCheckbox: checkMappings,
      paperToggleButton: checkMappings,
      paperDialog: {
        ngOpened: '=opened',
        ngOverlayOpened: '&iron-overlay-opened',
        ngOverlayClosed: '&iron-overlay-closed'
      },
      paperSlider: {
        ngModel: '=value',
        ngChange: '&value-change',
        ngDisabled: '=disabled'
      },
      goldEmailInput: inputMappings,
      goldPhoneInput: inputMappings,
      goldCcInput: {
        ngModel: '=value',
        ngDisabled: '=disabled',
        ngFocused: '=focused',
        ngCardType: '=cardType'
      },
      goldCcExpirationInput: inputMappings,
      goldCcCvcInput: inputMappings,
      goldZipInput: inputMappings,
      googleFeeds: {
        ngModel: '=results',
        loading: '=loading',
        ngError: '&google-feeds-error',
        ngQueryError: '&google-feeds-queryerror',
        ngQueryResponse: '&google-feeds-queryresponse',
        ngResponse: '&google-feeds-response',
        ngMultiResponse: '&google-multi-feeds-response'
      },
      googleMap: {
        ngMap: '=map',
        ngLatitude: '=latitude',
        ngLongitude: '=longitude'
      },
      googleSheets: {
        ngRows: '=rows',
        ngSheet: '=sheet',
        ngTab: '=tab'
      }
    };

    // Extension point for overriding mappings
    if($injector.has('$ngPolymerMappings')) {
      var extendedMappings = $injector.get('$ngPolymerMappings');
      angular.extend(allMappings, extendedMappings);
    }

    // A directive is created for each web component according to the mappings
    Object.keys(allMappings).forEach(function(tag) {
      var mappings = allMappings[tag];

      $compileProvider.directive(tag, ['$parse', '$window', function($parse,
        $window) {

        var scopeDefinition = {};
        var keys = Object.keys(mappings);
        keys.forEach(function(attr) {
          var mapped = mappings[attr];

          // For constant mapping, prefix "=" for property mapping and "&" for
          // event mapping.
          // For dynamic mapping, name the function "property" or "event".
          var mappingType;
          switch(typeof mapped) {
          case 'string':
            mappingType = mapped.charAt(0);
            if(mappingType !== '=' && mappingType !== '&') {
              throw 'Invalid mapping: "' + mapped
                + '" - must begin with "=" or "&"';
            }
            mapped = mapped.substr(1);
            break;
          case 'function':
            switch(mapped.name) {
            case 'property':
              mappingType = '=';
              break;
            case 'event':
              mappingType = '&';
              break;
            default:
              throw 'Invalid mapping for "' + attr
                + '" - function name must be "property" or "event"';
            }
            break;
          default:
            throw 'Invalid mapped type for "' + attr
              + '" - must be string or function';
          }
          scopeDefinition[attr] = mappingType;
        });

        return {
          restrict: 'E',
          scope: scopeDefinition,

          link: function (scope, element, attrs) {

            var el = element[0];

            var observers = {}

            scope.$on('$destroy', function () {
              Object.keys(observers).forEach(function(key) {
                var observer = observers[key];
                Object.unobserve(el[key], observer);
              });
            });

            keys.forEach(function(attr) {

              // Don't create bindings for non-existent attributes
              if(!attrs[attr]) {
                return;
              }

              var mapped = mappings[attr];
              var mappingType;
              if(typeof mapped === 'function') {
                mappingType = mapped.name === 'property' ? '=' : '&';
                mapped = mapped(el);
              } else {
                mappingType = mapped.charAt(0);
                mapped = mapped.substr(1);
              }

              if(mappingType === '&') {

                // Event mapping

                var fn = $parse(attrs[attr]);
                el.addEventListener(mapped, function (e) {
                  scope.$apply(function() {
                    fn(scope.$parent, {$event: e});
                  });
                });

              } else {

                // Property mapping

                var propertyName = mapped;
                var propertyInfo = el.getPropertyInfo(mapped);
                var propertyType = propertyInfo.type;
                var readOnly = propertyInfo.readOnly;

                // For object and array property types, if the element has no
                // initial value - set it to empty object/array.
                if(!readOnly && !el[propertyName]) {
                  switch(propertyType) {
                  case Array:
                    el[propertyName] = [];
                    break;
                  case Object:
                    el[propertyName] = {};
                    break;
                  }
                }

                // Observe changes to the array/object, and copy its content
                // to the directive attribute.
                var attachObserver = function() {
                  if(!readOnly) {
                    if(observers[propertyName]) {
                      Object.unobserve(el[propertyName],
                        observers[propertyName]);
                      delete observers[propertyName];
                    }
                    switch(propertyType) {
                    case Array:
                    case Object:
                      observers[propertyName] = function() {
                        scope.$apply(function() {
                          if(!scope[attr]) {
                            scope[attr] = propertyType === Array ? [] : {};
                          }
                          angular.copy(el[propertyName], scope[attr]);
                        });
                      }

                      Object.observe(el[propertyName], observers[propertyName]);
                      break;
                    }
                  }
                };

                attachObserver();

                // Copy the directive attribute value to the element's property.
                // For arrays and objects, copy the content.
                // The copying is deferred to the next event loop because some
                // elements (eg. gold-cc-input) may change the property value
                // immediately after inputting it, and we want to use only the
                // latest value.
                var handler = function() {
                  setTimeout(function() {
                    var value = scope[attr];
                    if(propertyType != Array && propertyType != Object) {

                      // Undefined value is ignored in order to allow binding to
                      // values without initiallizing them with an "empty"
                      // value. Some elements try to process the value on any
                      // change without safety check.
                      if(value !== undefined) {
                        el[propertyName] = value;
                      }
                    } else if(value) {
                      el[propertyName] = angular.copy(value);
                      attachObserver();
                    }
                  });
                };

                if(!readOnly) {
                  scope.$watch(attr, handler, true);
                  handler(scope[attr]);
                }

                // When the property value changes, copy its new value to the
                // directive attribute.
                var eventName = propertyName.replace(/([A-Z])/g, function($1) {
                  return '-' + $1.toLowerCase();
                }) + '-changed';
                el.addEventListener(eventName, function(event) {
                  var value = el[propertyName]; //event.detail.value;
                  el.async(function() {
                    scope.$apply(function () {
                      if(propertyType === Array || propertyType === Object) {
                        scope[attr] = angular.copy(value);
                      } else {
                        if(scope[attr] != value) {
                          scope[attr] = value;
                        }
                      }
                    });
                    attachObserver();
                  });
                });
              }
            });
          }
        };
      }]);
    });
  }]);
})(angular);
