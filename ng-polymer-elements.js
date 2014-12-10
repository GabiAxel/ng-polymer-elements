(function(angular) {

    angular.module('ng-polymer-elements', [])
    	.config(['$compileProvider', '$injector', function($compileProvider, $injector) {
    		
    		'use strict';

    		// Each mapping is an object where the key is the directive/custom element
    	    // name in camel case and the value is an object where the keys are the
    	    // AngularJS attributes in camel case and the values are objects where the 
    	    // key is the type which can be 'primitive', 'object', 'array' or 'event' 
    	    // and the value is the name of the attribute in the web component.

    	    var inputMappings = {
    	        ngModel: {
    	            primitive: 'value'
    	        },
    	        ngDisabled: {
    	        	primitive: 'disabled'
    	        }
    	    };
    	    
    	    var selectorMappings = {
    	    	ngModel: {
    	    		primitive: 'selected'
    	    	}
    	    };
    	    
    	    var checkMappings = {
    	    	ngModel: {
    	    		primitive: 'checked'
    	    	},
    	        ngDisabled: {
    	        	primitive: 'disabled'
    	        }
    	    };
    	    
    	    var openableMappings = {
    	    	ngOpened: {
    	    		primitive: 'opened'
    	    	}
    	    };

    	    var allMappings = {
    	        paperInput: inputMappings,
    	        paperRadioGroup: selectorMappings,
    	        paperTabs: selectorMappings,
    	        coreSelector: selectorMappings,
    	        coreMenu: selectorMappings,
    	        paperCheckbox: checkMappings,
    	        paperToggleButton: checkMappings,
    	        coreOverlay: openableMappings,
    	        paperDialog: openableMappings,
    	        paperActionDialog: openableMappings,
    	        paperToast: openableMappings,
    	        paperSlider: inputMappings,
    	        coreList: {
    	            ngModel: {
    	                array: 'data'
    	            },
    	            ngTap: {
    	                event: 'core-activate'
    	            }
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
		
		        $compileProvider.directive(tag, ['$parse', '$window', function($parse, $window) {
		
		            var scopeDefinition = {};
		
		            var keys = Object.keys(mappings);
		
		            keys.forEach(function(attr) {
		
		                var conf = mappings[attr];
		
		                if(conf.primitive || conf.object || conf.array) {
		                    scopeDefinition[attr] = '=';
		                } else if(!conf.event) {
		                    throw 'Invalid mapping for ' + attr + 
		                    ' - must contain primitive | object | array | event';
		                }
		            });
		
		            return {
		                restrict: 'E',
		                scope: scopeDefinition,
		
		                link: function (scope, element, attrs) {
		
		                    var el = element[0];
		
		                    keys.forEach(function(attr) {
		
		                    	// Don't create bindings for non-existent attributes
		                    	if(!attrs[attr]) {
		                    		return;
		                    	}
		                    	
		                        var conf = mappings[attr];
		
		                        if(conf.event) {
		                        	
		                        	var fn = $parse(attrs[attr]);
		
		                            el.addEventListener(conf.event, function (e) {
		                            	scope.$apply(function() {
		                            		fn(scope.$parent, {$event: e});
		                            	});
		                                
		                            });
		
		                        } else {
		
		                            var propertyName = 
		                            	conf.primitive || conf.object || conf.array;
		
		                            if(conf.object) {
		                                el[propertyName] = {};
		                            } else if(conf.array) {
		                                el[propertyName] = [];
		                            }
		
		                            // Copy the scope property value to the web 
		                            // component's value
		                            
		                            var handler = function(value) {
		                                if(conf.primitive) {
		                            		el[propertyName] = value;
		                                } else {
		                                    angular.copy(value, el[propertyName]);
		                                }
		                            };
		
		                            scope.$watch(attr, handler, true);
		
		                            handler(scope[attr]);
		                            
		                            // Copy the web component's value to the scope 
		                            // property value
		                            
		                            var observer = new PathObserver(el, propertyName);
		
		                            observer.open(function (value) {
		                                scope.$apply(function () {
		                                    if(conf.primitive) {
		                                        scope[attr] = value;
		                                    } else {
		                                        angular.copy(value, scope[attr]);
		                                    }
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
