/*
**  GemstoneJS -- Gemstone JavaScript Technology Stack
**  Copyright (c) 2016-2019 Gemstone Project <http://gemstonejs.com>
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
                presets: [
                    [ "@babel/preset-env", {
                        "targets": { "node": "8.0.0" }
                    } ]
                ],
                plugins: [
                    [ "@babel/plugin-transform-runtime", {
                        "corejs":      2,
                        "helpers":     true,
                        "regenerator": false
                    } ]
                ]
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

