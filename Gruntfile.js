/*!
* Tree Gruntfile
* @author Ilia Kolev
*/

'use strict';

/**
* Grunt module
*/
module.exports = function (grunt) {

    /**
     * Displays the elapsed execution time of grunt tasks
     */
    require('time-grunt')(grunt);

    /**
     * JIT plugin loader for Grunt
     * https://github.com/shootaroo/jit-grunt
     * https://github.com/gruntjs/grunt/issues/975#issuecomment-29058707
     */
    require('jit-grunt')(grunt);

    /**
     * Project configuration
     */
    grunt.initConfig({

        /**
         * Store your Package file so you can reference its specific data whenever necessary
         */
        pkg: grunt.file.readJSON('package.json'),

        /**
         * Set project info
         */
        project: {
            www: 'www',
            js: [
                '<%= project.www %>/assets/js/vendor/*.js',
                '<%= project.www %>/assets/js/src/*.js'
            ]
        },

        /**
         * Bowercopy
         * https://npmjs.org/package/grunt-bowercopy
         * Scrupulously manage file locations for bower dependencies.
         */
        bowercopy: {
            options: {
                srcPrefix: 'bower_components',
                clean: true
            },
            jquery: {
                options: {
                    destPrefix: 'www/assets/js/vendor'
                },
                files: {
                    'jquery.min.js': 'jquery/jquery.min.js'
                }
            },
            susy: {
                files: {
                    'www/assets/sass/addons': 'susy/sass'
                }
            },
            normalizer: {
                options: {
                    destPrefix: 'www/assets/sass/addons'
                },
                files: {
                    '_normalizer.scss': 'normalize-css/normalize.css'
                }
            }
        },

        /**
         * JSHint
         * https://github.com/gruntjs/grunt-contrib-jshint
         * Manage the options inside .jshintrc file
         */
        jshint: {
            files: [
                'www/assets/js/src/*.js',
                'Gruntfile.js'
            ],
            options: {
                jshintrc: '.jshintrc',
                ignores: [
                    'www/assets/js/scripts.js',
                    'www/assets/js/scripts.min.js',
                    'www/assets/js/vendor/*.js'
                ]
            }
        },

        /**
         * Concatenate JavaScript files
         * https://github.com/gruntjs/grunt-contrib-concat
         * Imports all .js files
         */
        concat: {
            dist: {
                src: '<%= project.js %>',
                dest:'www/assets/js/scripts.js'
            }
        },

        /**
         * Uglify (minify) JavaScript files
         * https://github.com/gruntjs/grunt-contrib-uglify
         * Compresses and minifies all JavaScript files into one
         */
        uglify: {
            dist: {
                files: {
                    'www/assets/js/scripts.min.js': 'www/assets/js/scripts.js'
                }
            }
        },

        /**
         * CSSO
         * Minify CSS files
         * https://github.com/t32k/grunt-csso
         */
        csso: {
            options: {
                report: 'min'
            },
            dist: {
                files: {
                    'www/assets/css/screen.min.css': ['www/assets/css/screen.css']
                }
            }
        },

        /**
         * Compile Sass to CSS using Compass
         * https://github.com/gruntjs/grunt-contrib-compass
         */
        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        },

        /**
         * Autoprefixer
         * Adds vendor prefixes automatically
         * https://github.com/nDmitry/grunt-autoprefixer
         */
        autoprefixer: {
            dist: {
                options: {
                    browsers: [
                        'last 2 version',
                        'safari 6',
                        'ie 9',
                        'opera 12.1',
                        'ios 6',
                        'android 4'
                    ]
                },
                src: 'www/assets/css/screen.css'
            }
        },

        /**
         * Runs tasks against changed watched files
         * https://github.com/gruntjs/grunt-contrib-watch
         */
        watch: {
            js: {
                files: '<%= project.js %>',
                tasks: ['concat', 'jshint', 'uglify']
            },
            sass: {
                files: 'www/assets/sass/{,*/}*.{scss,sass}',
                tasks: ['compass', 'autoprefixer', 'csso'],
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    '<%= project.www %>/{,*/}*.{html,php}',
                    '<%= project.www %>/assets/css/{,*/}*.css',
                    '<%= project.js %>',
                    '<%= project.www %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        }
    });

    /**
     * Default task
     * Run 'grunt' on the command line
     */
    grunt.registerTask('default', [
        'compass',
        'autoprefixer',
        'csso',
        'jshint',
        'watch'
    ]);

    /**
     * Build task
     * Run 'grunt build' on the command line
     * Then compress all JS/CSS files
     */
    grunt.registerTask('build', [
        'compass',
        'autoprefixer',
        'csso',
        'jshint',
        'uglify'
    ]);

    /**
     * Bower task
     * Alias bower to bowercopy
     * Run 'grunt bower'
     *
     * When updating a bower dependency, update the version in bower.json, run
     * 'grunt bower', and then commit the result. When adding a dependency,
     * update the bowercopy task accordingly.
     */
    grunt.registerTask( 'bower', 'bowercopy' );
};
