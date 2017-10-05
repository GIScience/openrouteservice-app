module.exports = function(grunt) {
    require('time-grunt')(grunt);
    var modRewrite = require('connect-modrewrite');
    grunt.initConfig({
        copy: {
            all: {
                cwd: 'app',
                src: ['**'],
                dest: 'build',
                expand: true
            },
            build: {
                expand: true,
                cwd: 'app',
                dest: 'build',
                src: ['img/**/*.png', 'languages/**/*.json', 'css/*.css', '*.html', '*.js', 'favicon.ico']
            },
            libs: {
                expand: true,
                cwd: './',
                dest: 'build',
                src: ['bower_components/font-awesome/**', 'bower_components/leaflet/**', 'bower_components/leaflet.heightgraph/**']
            }
        },
        watch: {
            options: {
                livereload: true,
            },
            less: {
                files: ['app/less/**/*.less'],
                tasks: ['less:development']
            },
            js: {
                files: ['app/**/*.js']
            },
            html: {
                files: ['app/**/*.html'],
                tasks: ['ngtemplates']
            }
        },
        // Clean stuff up
        clean: {
            task_rm_build: {
                src: ['build/*']
            },
            task_rm_build_unused: {
                src: ['build/components', 'build/infrastructure', 'build/languages', 'build/js/', 'build/constants', 'build/values', 'build/css']
            },
        },
        jshint: {
            all: ['build/js/*.js', 'build/components/**/*.js'],
            options: {
                globals: {
                    _: false,
                    $: false,
                    angular: false,
                    orsApp: true
                },
                browser: true,
                devel: true,
                esnext: true
            }
        },
        htmlhint: {
            build: {
                options: {
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'attr-lowercase': true,
                    'attr-value-double-quotes': true,
                    'doctype-first': true,
                    'spec-char-escape': true,
                    'id-unique': true,
                    'head-script-disabled': false,
                    'style-disabled': true
                },
                src: ['build/index.html']
            }
        },
        useminPrepare: {
            html: 'build/index.html',
            options: {
                dest: 'build'
            }
        },
        usemin: {
            html: ['build/index.html'],
            css: ['build/index.html']
        },
        // uglify: {
        //     build: {
        //         options: {
        //             mangle: true
        //         },
        //         files: {
        //             'build/application.js': ['build/js/**/*.js', 'build/pages/**/*.js']
        //         }
        //     }
        // },
        uglify: {
            options: {
                preserveComments: 'false', //"some", "all",
                compress: false,
                mangle: false
            },
        },
        preprocess: {
            options: {
                inline: true,
                context: {
                    DEBUG: false
                }
            },
            html: {
                src: ['build/index.html']
            }
        },
        jsdoc: {
            dist: {
                src: ['app/js/*.js', 'app/components/**/*.js'],
                options: {
                    destination: 'doc'
                }
            }
        },
        removelogging: {
            dist: {
                src: ["build/scripts.js", "build/vendor.js"] // Each file will be overwritten with the output! 
            },
            namespace: ['console', 'console.info', 'console.warn']
        },
        traceur: {
            options: {
                copyRuntime: 'build/',
                //script: true,
                moduleNames: false,
                modules: 'inline'
            },
            custom: {
                files: [{
                    expand: true,
                    cwd: 'app/',
                    //src: ['js/**/*.js'],
                    src: ['components/**/*.js', 'constants/**/*.js', 'values/**/*.js', 'infrastructure/**/*.js', 'js/**/*.js'],
                    dest: 'build/'
                }]
            },
        },
        connect: {
            dev: {
                options: {
                    hostname: 'localhost',
                    port: 3005,
                    //base: 'src',
                    livereload: true,
                    open: true,
                    middleware: function(connect, options, middlewares) {
                        return [
                            //modRewrite(['^[^\\.]*$ /index.html [L]']),
                            modRewrite(['!\\.html|\\.js|\\.txt|\\.ico|\\.svg|\\.map|\\.woff2|\\.woff|\\.ttf|\\.css|\\.png$ /index.html [L]']),
                            connect()
                            .use('/bower_components', connect.static('./bower_components')),
                            connect()
                            .use('/node_modules', connect.static('./node_modules')),
                            connect.static('./app')
                        ];
                    }
                }
            },
            build: {
                options: {
                    hostname: 'localhost',
                    port: 3035,
                    open: true,
                    base: './build',
                    middleware: function(connect) {
                        return [
                            //modRewrite(['^[^\\.]*$ /index.html [L]']),
                            modRewrite(['!\\.html|\\.js|\\.txt|\\.ico|\\.svg|\\.map|\\.woff2|\\.woff|\\.ttf|\\.css|\\.png$ /index.html [L]']),
                            connect.static('./build')
                        ];
                    }
                }
            }
        },
        tags: {
            build: {
                src: ['build/traceur_runtime.js'],
                dest: 'build/index.html'
            }
        },
        browserify: {
            turf: {
                src: 'main.js',
                dest: 'node_modules/turf.js',
                options: {
                    browserifyOptions: {
                        standalone: 'turf'
                    }
                }
            }
        },
        ngconstant: {
            // Options for all targets
            options: {
                space: '  ',
                wrap: '"use strict";\n\n {\%= __ngModule %}',
                name: 'config',
            },
            // Environment targets
            development: {
                options: {
                    dest: 'app/js/config.js'
                },
                constants: {
                    ENV: {
                        name: 'development',
                        geocoding: 'http://localhost:8082/openrouteservice-4.3.0/geocode',
                        routing: 'http://localhost:8082/openrouteservice-4.3.0/routes',
                        tmc: 'http://localhost:8082/openrouteservice-4.3.0/routes?tmc',
                        analyse: 'http://localhost:8082/openrouteservice-4.3.0/isochrones',
                        places: 'http://localhost:8082/openrouteservice-4.3.0/locations',
                        shortenlink: 'https://api-ssl.bitly.com/v3/shorten'
                    }
                },
            },
            zugspitze: {
                options: {
                    dest: 'app/js/config.js'
                },
                constants: {
                    ENV: {
                        name: 'development',
                        geocoding: 'http://129.206.228.124:8080/ors/geocode',
                        routing: 'http://129.206.228.124:8080/ors/routes',
                        tmc: 'http://129.206.228.124:8080/ors/routes?tmc',
                        analyse: 'http://129.206.228.124:8080/ors/isochrones',
                        places: 'http://129.206.228.124:8080/ors/locations',
                        shortenlink: 'https://api-ssl.bitly.com/v3/shorten'
                    }
                },
            },
            emergency: {
                options: {
                    dest: 'app/js/config.js'
                },
                constants: {
                    ENV: {
                        name: 'emergency',
                        geocoding: 'https://disaster-api.openrouteservice.org/emergency/geocode',
                        routing: 'https://disaster-api.openrouteservice.org/emergency/routes',
                        tmc: 'https://disaster-api.openrouteservice.org/emergency/routes?tmc',
                        analyse: 'https://disaster-api.openrouteservice.org/emergency/isochrones',
                        places: 'https://disaster-api.openrouteservice.org/emergency/locations',
                        shortenlink: 'https://api-ssl.bitly.com/v3/shorten'
                    }
                },
            },
            production: {
                options: {
                    dest: 'app/js/config.js'
                },
                constants: {
                    ENV: {
                        name: 'production',
                        geocoding: 'https://api.openrouteservice.org/pgeocoding',
                        routing: 'https://api.openrouteservice.org/pdirections',
                        tmc: 'http://129.206.228.124/routing-test?tmc',
                        analyse: 'https://api.openrouteservice.org/pisochrones',
                        places: 'https://api.openrouteservice.org/pplaces',
                        shortenlink: 'https://api-ssl.bitly.com/v3/shorten'
                    }
                }
            },
            labs: {
                options: {
                    dest: 'app/js/config.js'
                },
                constants: {
                    ENV: {
                        name: 'labs',
                        geocoding: 'https://labs-api.openrouteservice.org/ors/geocode',
                        routing: 'https://labs-api.openrouteservice.org/ors/routes',
                        tmc: 'http://labs-api.openrouteservice.org/ors/routes?tmc',
                        analyse: 'https://labs-api.openrouteservice.org/ors/isochrones',
                        places: 'https://labs-api.openrouteservice.org/ors/locations',
                        shortenlink: 'https://api-ssl.bitly.com/v3/shorten'
                    }
                }
            }
        },
        stripDebug: {
            dist: {
                files: {
                    'build/scripts.js': 'build/scripts.js'
                }
            }
        },
        cacheBust: {
            taskName: {
                options: {
                    assets: ['scripts.js', 'vendor.js', 'main.css', 'vendor.css'],
                    baseDir: './build',
                    deleteOriginals: true
                },
                src: ['./build/index.html']
            }
        },
        // TODO
        less: {
            development: {
                files: {
                    "app/css/ors-layout.css": "app/less/ors-layout.less",
                    "app/css/ors-leaflet.css": "app/less/ors-leaflet.less",
                    "app/css/ors-common.css": "app/less/ors-common.less",
                    "app/css/ors-header.css": "app/less/ors-header.less",
                    "app/css/ors-error.css": "app/less/ors-error.less",
                    "app/css/ors-icons.css": "app/less/ors-icons.less",
                    "app/css/ors-instructions.css": "app/less/ors-instructions.less",
                    "app/css/ors-loading.css": "app/less/ors-loading.less",
                    "app/css/ors-modal.css": "app/less/ors-modal.less",
                    "app/css/ors-locations.css": "app/less/ors-locations.less",
                    "app/css/ors-extras.css": "app/less/ors-extras.less",
                    "app/css/ors-nav-profiles.css": "app/less/ors-nav-profiles.less",
                    "app/css/ors-panel-isochrones.css": "app/less/ors-panel-isochrones.less",
                    "app/css/ors-panel-routing.css": "app/less/ors-panel-routing.less",
                    "app/css/ors-sidebar-outlet.css": "app/less/ors-sidebar-outlet.less",
                    "app/css/ors-tooltips.css": "app/less/ors-tooltips.less",
                    "app/css/ors-addresses.css": "app/less/ors-addresses.less"
                }
            }
        },
        ngtemplates: {
            orsApp: {
                cwd: 'app',
                src: ['components/**/*.html', 'includes/**/*.html', 'languages/**/*.json'],
                dest: 'app/js/templates.js'
            }
        }
        // connect: {
        //     options: {
        //         port: 3000,öä
        //         // Change this to '0.0.0.0' to access the server from outside.
        //         hostname: 'localhost',
        //         //livereload: 35729
        //     },
        //     livereload: {
        //         options: {
        //             open: true,
        //             middleware: function(connect) {
        //                 return [
        //                     modRewrite(['^[^\\.]*$ /index.html [L]']),
        //                     connect().use('/bower_components', connect.static('./bower_components')),
        //                     connect().use('/node_modules', connect.static('./node_modules')),
        //                     connect.static('./app')
        //                 ];
        //             }
        //         }
        //     },
        //     dist: {
        //         options: {
        //             open: true,
        //             base: './build'
        //         }
        //     }
        // }
        // connect: {
        //     app: {
        //         options: {
        //             port: 3000,
        //             //base: '/app',
        //             open: true,
        //             livereload: true,
        //             hostname: 'localhost',
        //             middleware: function(connect) {
        //                 return [
        //                     modRewrite(['^[^\\.]*$ /index.html [L]']),
        //                     connect().use('/bower_components', connect.static('./bower_components')),
        //                     connect().use('/node_modules', connect.static('./node_modules')),
        //                     connect.static('./app')
        //                 ];
        //             }
        //         }
        //     }
        // }
    });
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-htmlhint');
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.loadNpmTasks('grunt-traceur');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-script-link-tags');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-ng-constant');
    grunt.loadNpmTasks('grunt-strip-debug');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.registerTask('staging', 'Compiles all of the assets and copies the files to the build directory.', ['browserify:turf', 'less:development', 'ngtemplates', 'clean:task_rm_build', 'copy:build', 'ngconstant:development', 'traceur', 'useminPrepare', 'concat', 'copy:libs', 'uglify', 'cssmin', 'usemin', 'preprocess', 'tags', 'clean:task_rm_build_unused', 'stripDebug', 'cacheBust', 'connect:build:keepalive']);
    grunt.registerTask('build', 'Compiles all of the assets and copies the files to the build directory.', ['browserify:turf', 'less:development', 'ngtemplates', 'clean:task_rm_build', 'copy:build', 'ngconstant:production', 'traceur', 'useminPrepare', 'concat', 'copy:libs', 'uglify', 'cssmin', 'usemin', 'preprocess', 'tags', 'ngconstant:development', 'clean:task_rm_build_unused', 'stripDebug', 'cacheBust', 'connect:build:keepalive']);
    grunt.registerTask('zugspitze', 'Compiles all of the assets and copies the files to the build directory.', ['browserify:turf', 'less:development', 'ngtemplates', 'clean:task_rm_build', 'copy:build', 'ngconstant:zugspitze', 'traceur', 'useminPrepare', 'concat', 'copy:libs', 'uglify', 'cssmin', 'usemin', 'preprocess', 'tags', 'ngconstant:development', 'clean:task_rm_build_unused', 'stripDebug', 'cacheBust', 'connect:build:keepalive']);
    grunt.registerTask('emergency','Compiles all of the assets and copies the files to the build directory.', ['browserify:turf', 'less:development', 'ngtemplates', 'clean:task_rm_build', 'copy:build', 'ngconstant:emergency', 'traceur', 'useminPrepare', 'concat', 'copy:libs', 'uglify', 'cssmin', 'usemin', 'preprocess', 'tags', 'ngconstant:development', 'clean:task_rm_build_unused', 'stripDebug', 'cacheBust', 'connect:build:keepalive']);
    grunt.registerTask('serve', 'Run local server', ['less:development', 'browserify:turf', 'ngtemplates', 'ngconstant:development', 'connect:dev', 'watch']);
    grunt.registerTask('labs', 'Compiles all of the assets and copies the files to the build directory.', ['browserify:turf', 'less:development', 'clean:task_rm_build', 'copy:build', 'ngconstant:labs', 'traceur', 'useminPrepare', 'concat', 'copy:libs', 'uglify', 'cssmin', 'usemin', 'preprocess', 'tags', 'ngconstant:labs', 'clean:task_rm_build_unused', 'stripDebug', 'cacheBust', 'connect:build:keepalive']);
    grunt.registerTask('servelabs', 'Run local server', ['browserify:turf', 'less:development', 'ngconstant:labs', 'connect:dev', 'watch']);
};