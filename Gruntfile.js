module.exports = function(grunt) {
    grunt.initConfig({
        copy: {
            build: {
                cwd: 'app',
                src: ['**'],
                dest: 'build',
                expand: true
            },
            languages: {
                cwd: 'app/languages/',
                src: ['**'],
                dest: 'build/languages',
                expand: true
            },
        },
        // Clean stuff up
        clean: {
            task_rm_build: {
                src: ['build/*']
            },
            task_rm_build_unused: {
                src: ['build/js', 'build/infrastructure', 'build/css', 'build/components/**/*.js', 'build/lib/', '!build/lib/font-awesome/**']
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
                preserveComments: 'false', //"some", "all"
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
                src: ['build/index.html', ]
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
                src: ["build/components/**/*.js", "build/js/**/*.js", "build/infrastructure/**/*.js"] // Each file will be overwritten with the output! 
            },
            namespace: ['console', 'console.info', 'console.warn']
        },
        traceur: {
            options: {
                // traceur options here 
                blockBinding: true,
                experimental: true,
                // module naming options, 
                // moduleNaming: {
                //     stripPrefix: "buil",
                //     addPrefix: "com/mycompany/project"
                // },
                copyRuntime: 'build/js'
            },
            custom: {
                files: [{
                    expand: true,
                    cwd: 'build',
                    src: ['components/**/*.js', 'infrastructure/**/*.js', 'js/**/*.js'],
                    dest: 'build'
                }]
            },
        },
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
    // Clean the .git/hooks/pre-commit file then copy in the latest version 
    grunt.registerTask('build', 'Compiles all of the assets and copies the files to the build directory.', ['clean:task_rm_build', 'copy:build', 'removelogging', 'traceur', 'preprocess', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin', 'clean:task_rm_build_unused']);
    grunt.registerTask('transpile', 'ES6 to ES5', ['traceur']);

};