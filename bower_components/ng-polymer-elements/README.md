# ng-polymer-elements

## Introduction

Web components make is possible to write encapsulated pieces of view and logic independently from any framework. The Polymer project contains a platform for pollyfilling and writing web components, and two sets of web components: core elements and paper elements.

Although there are many similarities between the ways AngularJS and Polymer implement two-way binding, it's not possible to use two-way binding of AngularJS model with web components out of the box, and even one-way binding is limited only to strings.

ng-polymer-elements overcomes this by applying directived to Polymer web components, and each directive is in charge of mapping attributes that reference AngularJS models to the web component's properties.

For example, the following code binds the scope's "myText" property to Polymer's paper-input "inputValue" property using the ng-model attribute, very similarly to how it looks for a basic text input:

```html
<paper-input ng-model="myText"></paper-input>
```

## Installation and Bootstrapping

The project is available through Bower: `bower install ng-polymer-elements`

Add the script `ng-polymer-elements.js` or `ng-polymer-elements.min.js` to your page.

**Important** : In older browsers, AngularJS should be bootstrapped only after the custom elements have been registered, and therefore you can't use automatic bootstrapping (ng-app="..."). You need to call angular.bootstrap() only after Polymer has been loaded, and with a wrapped DOM element:

```javascript
function bootstrap() {
   angular.bootstrap(wrap(document), ['myModule']);
}
        
if(angular.isDefined(document.body.attributes['unresolved'])) {
   var readyListener = function() {
      bootstrap();
      window.removeEventListener('polymer-ready', readyListener);
   }
   window.addEventListener('polymer-ready', readyListener);
} else {
   bootstrap();
}
```

This is not needed if you are only targeting the latest Chrome and Opera, where you can simply use:

```html
<html ng-app="myModule>
```

Also add the ng-polymer-elements module to your application dependencies:

```javascript
angular.module('myModule', ['ng-polymer-elements']);
```

## Available Component Support

The following Polymer elements are support:

- [core-list](http://www.polymer-project.org/docs/elements/core-elements.html#core-list)
- [core-menu](http://www.polymer-project.org/docs/elements/core-elements.html#core-menu)
- [core-overlay](http://www.polymer-project.org/docs/elements/core-elements.html#core-overlay)
- [core-selector](http://www.polymer-project.org/docs/elements/core-elements.html#core-selector)
- [paper-action-dialog](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-action-dialog)
- [paper-checkbox](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-checkbox)
- [paper-dialog](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-dialog)
- [paper-input](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-input)
- [paper-radio-group](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-radio-group)
- [paper-slider](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-slider)
- [paper-tabs](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-tabs)
- [paper-toast](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-toast)
- [paper-toggle-button](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-toggle-button)

See [documentation](http://gabiaxel.github.io/ng-polymer-elements/) for usage examples.

## Supporting Additional Components

ng-polymer-elements uses a simple structure to map directive attributes to custom element properties. You can extend the mapping by setting the `$ngPolymerMappings` constant in the `ng-polymer-elements` module with your mappings.

The mapping structure is an object where the keys are the directive names, and their values are objects that contain a key for each directive attribute you want to map. The values for the directives are objects containing a single entry where the key is the type (`primitive`, `array`, `object` or `event`) and the value is the custom element property.

```javascript
angular.module('ng-polymer-elements').constant('$ngPolymerMappings', {
   newElement: {
      anAttribute: {
         primitive: 'an-attribute'
      },
      anEvent: {
         event: 'an-event'
      }
   }
});
```

In this example we add support for new-element and map an-attribute as a primitive value an an-event as an event. When mapping events, the original event will be available to AngularJS handlers as the $event parameter.

See `allMappings` in [ng-polymer-elements.js](https://github.com/GabiAxel/ng-polymer-elements/blob/master/ng-polymer-elements.js) for default mappings.