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
                src: ['img/**/*.png', 'includes/**/*.html', 'languages/**/*.json', 'components/**/*.html', 'globals/*.js', 'css/*.css', '*.html', '*.js']
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
            css: {
                files: ['app/css/**/*.css'],
            },
            js: {
                files: ['app/**/*.js']
            },
            html: {
                files: ['app/**/*.html']
            }
        },
        // Clean stuff up
        clean: {
            task_rm_build: {
                src: ['build/*']
            },
            task_rm_build_unused: {
                src: ['build/components/**/*.js', 'build/infrastructure', 'build/js/', 'build/globals', 'build/css']
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
                    src: ['components/**/*.js', 'infrastructure/**/*.js', 'js/**/*.js'],
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
                            modRewrite(['!\\.html|\\.js|\\.svg|\\.map|\\.woff2|\\.woff|\\.ttf|\\.css|\\.png$ /index.html [L]']),
                            connect().use('/bower_components', connect.static('./bower_components')),
                            connect().use('/node_modules', connect.static('./node_modules')),
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
                            modRewrite(['!\\.html|\\.js|\\.svg|\\.map|\\.woff2|\\.woff|\\.ttf|\\.css|\\.png$ /index.html [L]']),
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
        }
        // connect: {
        //     options: {
        //         port: 3000,
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
    // Clean the .git/hooks/pre-commit file then copy in the latest version 
    //grunt.registerTask('build', 'Compiles all of the assets and copies the files to the build directory.', ['clean:task_rm_build', 'copy:build', 'removelogging', 'preprocess', 'traceur', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin', 'clean:task_rm_build_unused']);
    //   grunt.registerTask('build', [
    //   'clean:dist',
    //   'traceur',
    //   'useminPrepare',
    //   'concurrent:dist',
    //   'autoprefixer',
    //   'concat',
    //   'ngAnnotate',
    //   'copy:dist',
    //   'cdnify',
    //   'cssmin',
    //   'uglify',
    //   'filerev',
    //   'usemin',
    //   'htmlmin'
    // ]);
    grunt.registerTask('build', 'Compiles all of the assets and copies the files to the build directory.', ['clean:task_rm_build', 'copy:build', 'traceur', 'useminPrepare', 'concat', 'copy:libs', 'uglify', 'cssmin', 'usemin', 'preprocess', 'tags', 'clean:task_rm_build_unused', 'connect:build:keepalive']);
    grunt.registerTask('serve', 'Run local server', ['connect:dev', 'watch']);
};
