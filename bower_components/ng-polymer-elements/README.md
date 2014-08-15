# ng-polymer-elements
===
## Introduction

Web components make is possible to write encapsulated pieces of view and logic independently from any framework. The Polymer project contains a platform for pollyfilling and writing web components, and two sets of web components: core elements and paper elements.

Although there are many similarities between the ways AngularJS and Polymer implement two-way binding, it's not possible to use two-way binding of AngularJS model with web components out of the box, and even one-way binding is limited only to strings.

ng-polymer-elements overcomes this by applying directived to Polymer web components, and each directive is in charge of mapping attributes that reference AngularJS models to the web component's properties.

For example, the following code binds the scope's "myText" property to Polymer's paper-input "inputValue" property using the ng-model attribute, very similarly to how it looks for a basic text input:

````
<paper-input ng-model="myText"></paper-input>
````

## Installation and Bootstrapping

The project is available through Bower: `bower install ng-polymer-elements`

Add the script `ng-polymer-elements.js` or `ng-polymer-elements.min.js` to your page.

**Important** : ng-polymer-elements requires that the Polymer platform be loaded and ready before running AngularJS bootstrapping. If you are using autmatic bootstrapping (ng-app="myModule" in your HTML) then ng-polymer-elements will handle this for you, but if you use manual bootstrapping you need to make sure it happens after the 'polymer-ready' event has been fired **and** wrap the target DOM element:

````
window.addEventListener('polymer-ready', function() {
    angular.bootstrap(wrap(document), ['myModule']);
});
````

Add the ng-polymer-elements module to your application dependencies:

````
angular.module('myModule', ['ng-polymer-elements']);
````

## Available Component Support

The following components support two-way binding of primitive values using ng-model:

- [core-input](http://www.polymer-project.org/docs/elements/core-elements.html#core-input)
- [paper-input](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-input)
- [paper-radio-group](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-radio-group)
- [paper-tabs](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-tabs) (bind the index of the selected tab)
- [paper-checkbox](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-checkbox)
- [paper-toggle-button](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-toggle-button)
- [core-overlay](http://www.polymer-project.org/docs/elements/core-elements.html#core-overlay) (bind the opened state)
- [paper-dialog](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-dialog) (bind the opened state)
- [paper-toast](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-toast) (bind the opened state)
- [paper-slider](http://www.polymer-project.org/docs/elements/paper-elements.html#paper-slider)

For [core-list](http://www.polymer-project.org/docs/elements/core-elements.html#core-list) ng-model is used to bind the list data, and ng-tap is used to bind the tap event, and exposes the event as "$event".

````
<core-list ng-model="arrayData" ng-tap="onTap($event)">
    <template>
        <div>{{text}}</div>
    </template>
</core-list>

$scope.arrayData = [{text: 'one'}, {text: 'two'}, {text: 'three'}];

$scope.onTap = function(event) {
    var tappedItem = event.details.data;
};
````
See  /example/index.html for coverage of most supported components.

## Supporting Additional Components

You can easily add mapping for additional components, or change the provided mappings, by setting `window.NG_POLYMER_ELEMENTS_EXTENDED_MAPPINGS` with the new mapping definition object. The keys in the top level are the names of the directives (which are the same as the web components) in camel case. The values are object containing a key for each attribute that will be used to bind AngularJS models, and the value of each such key is an object with a single entry where the key is the type (primitive, object, array or event) and the value is the web component's property to bind.

In the following example we add support for my-component, with binding of the value in the "ng-model" attribute to my-component's "itemValue", and the event in the "ng-click" attribute to my-component's "item-clicked" event:

````
window.NG_POLYMER_ELEMENTS_EXTENDED_MAPPINGS = {
    myComponent: {
        ngModel: {
            primitive: 'itemValue'
        },
        ngClick: {
            event: 'item-clicked'
        }
    }
};
````

The above definition will allow us to write the following:

````
<my-component ng-model="someValue" ng-click="doSomething($event)"></my-component>
````