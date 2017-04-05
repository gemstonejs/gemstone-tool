/*
**  gemstone-tool -- Build-Time Tool for Gemstone Technology Stack
**  Copyright (c) 2016-2017 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* global module:  false */
/* global require: false */
/* eslint no-console: 0 */

var path  = require("path")
var chalk = require("chalk")

module.exports = function (grunt) {
    /*  define the Grunt task  */
    grunt.registerMultiTask("gemstone", "Gemstone Tool Commands", function () {
        /*  prepare options  */
        let options = this.options({
            foo: "bar"
        })
        grunt.verbose.writeflags(options, "Options")

        /*  iterate over all src-dest file pairs  */
        this.files.forEach((f) => {
            try {
                f.src.forEach((src) => {
                    if (!grunt.file.exists(src))
                        throw new Error("Source file \"" + chalk.red(src) + "\" not found.")
                    else {
                        /*  determine destination path  */
                        var dest = f.dest
                        if (grunt.file.isDir(dest))
                            dest = path.join(dest, path.basename(src))

                        /*  read, expand and post-adjust source  */
                        var txt = grunt.file.read(src)

                        /*  write destination  */
                        grunt.file.write(dest, txt)
                        grunt.log.writeln("File \"" + chalk.green(dest) + "\" created.")
                    }
                })
            }
            catch (e) {
                grunt.fail.warn(e)
            }
        })
    })
}

