/**
@toc
2. load grunt plugins
3. init
4. setup variables
5. grunt.initConfig
6. register grunt tasks

*/

'use strict';

module.exports = function(grunt) {

	/**
	Load grunt plugins
	@toc 2.
	*/
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');

	/**
	Function that wraps everything to allow dynamically setting/changing grunt options and config later by grunt task. This init function is called once immediately (for using the default grunt options, config, and setup) and then may be called again AFTER updating grunt (command line) options.
	@toc 3.
	@method init
	*/
	function init(params) {
		/**
		Project configuration.
		@toc 5.
		*/
		grunt.initConfig({
			jshint: {
				options: {
					//force:          true,
					globalstrict:   true,
					//sub:            true,
					node: true,
					loopfunc: true,
					browser:        true,
					devel:          true,
					globals: {
						angular:    false,
						$:          false,
						moment:		false,
						Pikaday: false,
						module: false,
						forge: false
					}
				}
			},
			uglify: {
				options: {
					mangle: false
				},
				build: {
					files:  {},
					src:    'ng-polymer-elements.js',
					dest:   'ng-polymer-elements.min.js'
				}
			},
            clean: {
                            build: ['build']
                        },
                        'gh-pages': {
                            options: {
                                base: 'build/example'
                            },
                            src: ['**']
                        },
                        copy: {
                            build: {
                                files: [
                                    {expand: true, src: ['example/**/*'], dest: 'build/', filter: 'isFile'},
                                    {src: ['ng-polymer-elements.js'], dest: 'build/example/', filter: 'isFile'}
                                ]
                            }
                        },
                        replace: {
                          build: {
                            src: ['build/example/index.html'],
                              overwrite: true,
                            replacements: [{
                              from: '../ng-polymer-elements.js',
                              to: 'ng-polymer-elements.js'
                            }]
                          }
                        }
		});


		/**
		register/define grunt tasks
		@toc 6.
		*/
		// Default task(s).
		// grunt.registerTask('default', ['jshint:beforeconcat', 'less:development', 'concat:devJs', 'concat:devCss']);
		grunt.registerTask('default', ['uglify:build']);
        grunt.registerTask('release', ['clean:build', 'copy:build', 'replace:build', 'gh-pages']);


	}
	init({});		//initialize here for defaults (init may be called again later within a task)

};
