/*
**  GemstoneJS -- Gemstone JavaScript Technology Stack
**  Copyright (c) 2016-2017 Gemstone Project <http://gemstonejs.com>
**  Licensed under Apache License 2.0 <https://spdx.org/licenses/Apache-2.0>
*/

/* global module: true */
module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-eslint")
    grunt.loadNpmTasks("grunt-babel")
    grunt.loadNpmTasks("grunt-contrib-clean")
    grunt.initConfig({
        eslint: {
            options: {
                configFile: "eslint.yaml"
            },
            "gemstone-tool": [ "src/**/*.js" ]
        },
        babel: {
            options: {
                presets: [ "es2015", "es2016", "es2017", "stage-3", "stage-2" ],
                plugins: [ "transform-runtime" ]
            },
            "gemstone-tool-cli": {
                files: {
                     "bin/gemstone-tool-cli.js": "src/gemstone-tool-cli.js"
                }
            },
            "gemstone-tool-api": {
                files: {
                     "lib/gemstone-tool-api.js": "src/gemstone-tool-api.js"
                }
            },
            "gemstone-tool-grunt": {
                files: {
                     "tasks/gemstone-tool-grunt.js": "src/gemstone-tool-grunt.js"
                }
            }
        },
        clean: {
            clean: [ "bin", "lib", "tasks" ],
            distclean: [ "node_modules" ]
        }
    })
    grunt.registerTask("default", [ "eslint", "babel" ])
}

