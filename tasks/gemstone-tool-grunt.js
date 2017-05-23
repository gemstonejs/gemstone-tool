"use strict";

/*
**  GemstoneJS -- Gemstone JavaScript Technology Stack
**  Copyright (c) 2016-2017 Gemstone Project <http://gemstonejs.com>
**  Licensed under Apache License 2.0 <https://spdx.org/licenses/Apache-2.0>
*/

/* global module:  false */
/* global require: false */
/* eslint no-console: 0 */

var path = require("path");
var chalk = require("chalk");

module.exports = function (grunt) {
    /*  define the Grunt task  */
    grunt.registerMultiTask("gemstone", "Gemstone Tool Commands", function () {
        /*  prepare options  */
        var options = this.options({
            foo: "bar"
        });
        grunt.verbose.writeflags(options, "Options");

        /*  iterate over all src-dest file pairs  */
        this.files.forEach(function (f) {
            try {
                f.src.forEach(function (src) {
                    if (!grunt.file.exists(src)) throw new Error("Source file \"" + chalk.red(src) + "\" not found.");else {
                        /*  determine destination path  */
                        var dest = f.dest;
                        if (grunt.file.isDir(dest)) dest = path.join(dest, path.basename(src));

                        /*  read, expand and post-adjust source  */
                        var txt = grunt.file.read(src);

                        /*  write destination  */
                        grunt.file.write(dest, txt);
                        grunt.log.writeln("File \"" + chalk.green(dest) + "\" created.");
                    }
                });
            } catch (e) {
                grunt.fail.warn(e);
            }
        });
    });
};
