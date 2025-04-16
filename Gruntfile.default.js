module.exports = function (grunt) {
    require("time-grunt")(grunt)
    require("load-grunt-tasks")(grunt, {
        pattern: ["grunt-*", "!grunt-cli*"]
    })
    let modRewrite = require("connect-modrewrite")
    let serveStatic = require("serve-static")
    grunt.initConfig({
        copy: {
            all: {
                expand: true, cwd: "app", src: ["**"], dest: "build"
            }, build: {
                expand: true, cwd: "app", src: [
                    "img/**/*.png",
                    "languages/**/*.json",
                    "css/*.css",
                    "*.html",
                    "*.js",
                    "favicon.ico",
                    "weathercheck.txt"
                ], dest: "build"
            }, essentials: {
                expand: true, cwd: "app", src: [
                    "weathercheck.txt"
                ], dest: "build"
            }, libs: {
                expand: true, cwd: "./", src: [
                    "node_modules/font-awesome/**",
                    "node_modules/leaflet/**",
                    "node_modules/leaflet.heightgraph/dist/**"
                ], dest: "build"
            }
        }, watch: {
            options: {
                livereload: true
            }, less: {
                files: ["app/less/**/*.less"], tasks: ["newer:less:development"]
            }, less_sliders: {
                files: ["app/less/angularjs-slider.variables.less"], tasks: ["less:development"]
            }, js: {
                files: ["app/**/*.js"] // tasks: ["newer:prettier"]
            }, html: {
                files: ["app/**/*.html"], tasks: ["ngtemplates:orsApp"]
            }, essentials: {
                files: ["app/weathercheck.txt"], tasks: ["clean:task_rm_build_essentials", "copy:essentials"]
            }
        }, clean: {
            task_rm_build: {
                src: ["build/*", "build"]
            }, task_rm_build_unused: {
                src: [
                    "build/components",
                    "build/infrastructure",
                    "build/languages",
                    "build/js/",
                    "build/constants",
                    "build/values",
                    "build/css",
                    ".tmp"
                ]
            }, task_rm_build_essentials: {
                src: [
                    "build/weathercheck.txt", "build/floodedAreas.json"
                ]
            }
        }, jshint: {
            all: ["build/js/*.js", "build/components/**/*.js"], options: {
                globals: {
                    _: false, $: false, angular: false, orsApp: true
                }, browser: true, devel: true, esnext: true
            }
        }, useminPrepare: {
            html: "build/index.html", options: {
                dest: "build"
            }
        }, usemin: {
            html: ["build/index.html"], css: ["build/index.html"]
        }, uglify: {
            options: {
                "output.comments": false, //"some", "all",
                compress: false, mangle: false
            }
        }, preprocess: {
            options: {
                inline: true, context: {
                    DEBUG: false
                }
            }, html: {
                src: ["build/index.html"]
            }
        }, jsdoc: {
            dist: {
                src: ["app/js/*.js", "app/components/**/*.js"], options: {
                    destination: "doc"
                }
            }
        }, removelogging: {
            dist: {
                src: ["build/scripts.js", "build/vendor.js"] // Each file will be overwritten with the output!
            }, namespace: ["console", "console.info", "console.warn"]
        }, traceur: {
            options: {
                copyRuntime: "build/", moduleNames: false, modules: "inline"
            }, custom: {
                files: [
                    {
                        expand: true, cwd: "app/", src: [
                            "components/**/*.js",
                            "constants/**/*.js",
                            "values/**/*.js",
                            "infrastructure/**/*.js",
                            "js/**/*.js"
                        ], dest: "build/"
                    }
                ]
            }
        }, prettier: {
            files: {
                src: ["app/**/**.js"]
            }
        }, connect: {
            dev: {
                options: {
                    hostname: "localhost", port: 3005, livereload: true, middleware: function (connect) {
                        return [
                            modRewrite(["!\\.html|\\.js|\\.txt|\\.ico|\\.svg|\\.map|\\.woff2|\\.woff|\\.ttf|\\.css|\\.png$ /index.html [L]"]),
                            connect().use("/node_modules", serveStatic("./node_modules")),
                            serveStatic("./app")
                        ]
                    }
                }
            }, build: {
                options: {
                    hostname: "0.0.0.0", port: 3035, middleware: function (a) {
                        return [
                            modRewrite(["!\\.html|\\.js|\\.txt|\\.ico|\\.svg|\\.map|\\.woff2|\\.woff|\\.ttf|\\.css|\\.png$ /index.html [L]"]),
                            serveStatic("./build")
                        ]
                    }
                }
            }
        }, tags: {
            build: {
                src: ["build/traceur_runtime.js"], dest: "build/index.html"
            }
        }, browserify: {
            turf: {
                src: "main.js", dest: "node_modules/turf.js", options: {
                    browserifyOptions: {
                        standalone: "turf"
                    }
                }
            }
        }, ngconstant: {
            options: {
                space: "  ", wrap: "\"use strict\";\n\n {\%= __ngModule %}", name: "config"
            }, ors: {
                options: {
                    dest: "app/js/config.js"
                }, constants: {
                    ENV: {
                        name: "production",
                        geocode: "https://api.openrouteservice.org/pgeocode",
                        directions: "https://api.openrouteservice.org/v2/pdirections",
                        isochrones: "https://api.openrouteservice.org/v2/pisochrones",
                        matrix: "https://api.openrouteservice.org/v2/pmatrix",
                        pois: "https://api.openrouteservice.org/ppois",
                        shortenlink: "https://api-ssl.bitly.com/v3/shorten",
                        landmarks: "https://landmarks-api.openrouteservice.org/",
                        fuel: "https://api.openrouteservice.org/pfuel"
                    }
                }
            }, tardur: {
                options: {
                    dest: "app/js/config.js"
                }, constants: {
                    ENV: {
                        name: "api",
                        geocode: "https://api.openrouteservice.org/geocode",
                        directions: "https://api.openrouteservice.org/tardur/v2/directions",
                        isochrones: "https://api.openrouteservice.org/tardur/v2/isochrones",
                        matrix: "https://api.openrouteservice.org/tardur/v2/matrix",
                        pois: "https://api.openrouteservice.org/pois",
                        shortenlink: "https://api-ssl.bitly.com/v3/shorten",
                        landmarks: "https://landmarks-api.openrouteservice.org/",
                        fuel: "https://api.openrouteservice.org/fuel"
                    }
                }
            }, api: {
                options: {
                    dest: "app/js/config.js"
                }, constants: {
                    ENV: {
                        name: "api",
                        geocode: "https://api.openrouteservice.org/geocode",
                        directions: "https://api.openrouteservice.org/v2/directions",
                        isochrones: "https://api.openrouteservice.org/v2/isochrones",
                        matrix: "https://api.openrouteservice.org/v2/matrix",
                        pois: "https://api.openrouteservice.org/pois",
                        shortenlink: "https://api-ssl.bitly.com/v3/shorten",
                        landmarks: "https://landmarks-api.openrouteservice.org/",
                        fuel: "https://api.openrouteservice.org/fuel"
                    }
                }
            }
        }, stripDebug: {
            dist: {
                files: {
                    "build/scripts.js": "build/scripts.js"
                }
            }
        }, cacheBust: {
            taskName: {
                options: {
                    assets: ["scripts.js", "vendor.js", "main.css", "vendor.css"],
                    baseDir: "./build",
                    deleteOriginals: true
                }, src: ["./build/index.html"]
            }
        }, less: {
            development: {
                files: {
                    "app/css/ors-addresses.css": "app/less/ors-addresses.less",
                    "app/css/ors-common.css": "app/less/ors-common.less",
                    "app/css/ors-error.css": "app/less/ors-error.less",
                    "app/css/ors-extras.css": "app/less/ors-extras.less",
                    "app/css/ors-header.css": "app/less/ors-header.less",
                    "app/css/ors-icons.css": "app/less/ors-icons.less",
                    "app/css/ors-instructions.css": "app/less/ors-instructions.less",
                    "app/css/ors-landmark.css": "app/less/ors-landmark.less",
                    "app/css/ors-layout.css": "app/less/ors-layout.less",
                    "app/css/ors-leaflet.css": "app/less/ors-leaflet.less",
                    "app/css/ors-loading.css": "app/less/ors-loading.less",
                    "app/css/ors-locations.css": "app/less/ors-locations.less",
                    "app/css/ors-modal.css": "app/less/ors-modal.less",
                    "app/css/ors-nav-profiles.css": "app/less/ors-nav-profiles.less",
                    "app/css/ors-panel-isochrones.css": "app/less/ors-panel-isochrones.less",
                    "app/css/ors-panel-routing.css": "app/less/ors-panel-routing.less",
                    "app/css/ors-sidebar-outlet.css": "app/less/ors-sidebar-outlet.less",
                    "app/css/ors-tooltips.css": "app/less/ors-tooltips.less",
                    "app/css/ors-ng-sliders.css": "app/less/ors-ng-sliders.less"
                }
            }
        }, ngtemplates: {
            orsApp: {
                cwd: "app",
                src: ["components/**/*.html", "includes/**/*.html", "languages/**/*.json"],
                dest: "app/js/templates.js"
            }
        }, version: {
            app: {
                options: {
                    prefix: "@version: "
                }, src: ["app/js/app.js"]
            }, infrastructure: {
                options: {
                    prefix: "let version = \""
                }, src: ["app/infrastructure/ors-importexport-service.js"]
            }, ors: {
                src: ["package.json", "app/components/ors-navigation/ors-nav.js"]
            }
        }, "npm-command": {
            default: {
                options: {
                    cwd: "./"
                }
            }
        }
    })
    // for development
    grunt.registerTask("dev", "Run local server", [
        "less:development", "prettier", "browserify:turf", "ngtemplates", "ngconstant:api", "connect:dev", "watch"
    ])
    grunt.registerTask("api", "Points to api.openrouteservice.org, API KEY NEEDED IN WEATHERCHECK.TXT!", [
        "less:development", "prettier", "browserify:turf", "ngtemplates", "ngconstant:api", "connect:dev", "watch"
    ])
    // for production (copy to Build folder)
    grunt.registerTask("ors", "Compiles all of the assets and copies the files to the build directory. Points to public endpoints.", [
        "browserify:turf",
        "less:development",
        "prettier",
        "ngtemplates",
        "clean:task_rm_build",
        "copy:build",
        "ngconstant:ors",
        "traceur",
        "useminPrepare",
        "concat",
        "copy:libs",
        "uglify",
        "cssmin",
        "usemin",
        "preprocess",
        "tags",
        "clean:task_rm_build_unused",
        "stripDebug",
        "cacheBust",
        "connect:build",
        "watch:essentials"
    ])
    grunt.registerTask("staging", "Compiles all of the assets and copies the files to the build directory.", [
        "browserify:turf",
        "less:development",
        "prettier",
        "ngtemplates",
        "clean:task_rm_build",
        "copy:build",
        "ngconstant:api",
        "traceur",
        "useminPrepare",
        "concat",
        "copy:libs",
        "uglify",
        "cssmin",
        "usemin",
        "preprocess",
        "tags",
        "clean:task_rm_build_unused",
        "stripDebug",
        "cacheBust",
        "connect:build:keepalive"
    ])
    // run tests
    grunt.registerTask("ci", "Test build process with Travis", [
        "browserify:turf",
        "less:development",
        "prettier",
        "ngtemplates",
        "clean:task_rm_build",
        "copy:build",
        "ngconstant:ors",
        "traceur",
        "useminPrepare",
        "concat",
        "copy:libs",
        "uglify",
        "cssmin",
        "usemin",
        "preprocess",
        "tags",
        "clean:task_rm_build_unused",
        "stripDebug",
        "cacheBust"
    ])
    // bump Version
    grunt.registerTask("up", "Bump patch number in all important files", function (arg1) {
        if (arguments.length === 0) {
            grunt.task.run(["version::patch", "npm-command"])
        } else if (arg1 === "minor") {
            grunt.task.run(["version::minor", "npm-command"])
        } else if (arg1 === "major") {
            grunt.task.run(["version::major", "npm-command"])
        } else {
            grunt.log.writeln("Run \"grunt up\" task without arguments to bump patch version and \"grunt up:minor\" or \"grunt up:major\" for bumping minor or major version.")
        }
    })
}
