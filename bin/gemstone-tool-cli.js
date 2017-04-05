#!/usr/bin/env node
"use strict";

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _dashdash = require("dashdash");

var _dashdash2 = _interopRequireDefault(_dashdash);

var _gemstoneToolApi = require("../lib/gemstone-tool-api");

var _gemstoneToolApi2 = _interopRequireDefault(_gemstoneToolApi);

var _package = require("../package.json");

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 *  STEP 1: Parse global options
 */

/*
**  gemstone-tool -- Gemstone Technology Stack Tool
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

var options = [{ names: ["help", "h"], type: "bool", "default": false,
    help: "Print tool usage and exit." }, { names: ["version"], type: "bool", "default": false,
    help: "Print tool version and exit." }, { names: ["verbose", "v"], env: "GEMTOOL_VERBOSE", type: "bool", "default": false,
    help: "Enable verbosity in outputs." }, { names: ["color", "c"], env: "GEMTOOL_COLOR", type: "bool", "default": _chalk2.default.supportsColor,
    help: "Enable colors in outputs." }, { names: ["plugins", "p"], type: "string", "default": "",
    help: "Plugins to load.", helpArg: "NAME[,...]" }];
var parser = _dashdash2.default.createParser({
    options: options,
    interspersed: false
});
var opts = void 0;
try {
    opts = parser.parse(process.argv);
} catch (ex) {
    process.stderr.write("gemstone: ERROR: " + ex.message + "\n");
    process.exit(1);
}

/*
 *  STEP 2: Execute global options
 */

if (opts.help) {
    var help = parser.help().trimRight();
    process.stdout.write("gemstone: USAGE: gemstone [options] command [arguments]\n" + "options:\n" + help + "\n");
    process.exit(0);
} else if (opts.version) {
    process.stdout.write(_package2.default.name + " " + _package2.default.version + "\n");
    process.exit(0);
}

/*
 *  STEP 3: Load API and the requested plugins
 */

var gemstone = new _gemstoneToolApi2.default({
    verbose: opts.verbose,
    color: opts.color
});
if (opts.plugins !== "") {
    var plugins = opts.plugins.split(/,/);
    gemstone.use(plugins);
}

/*
 *  STEP 4: Parse command-line arguments
 */

var args = opts._args;

if (args.length === 0) args = ["help"];

var pluginName = args.shift();
var pluginOpts = {};
var pluginArgs = [];

var convertValue = function convertValue(val) {
    if (val.match(/^(?:true|false)$/)) val = val === "true";else if (val.match(/^[+-]?[0-9]+$/)) val = parseInt(val, 10);else if (val.match(/^[+-]?[0-9]*\.?[0-9]+(?:[eE][+-]?[0-9]+)?$/)) val = parseFloat(val);
    return val;
};

while (args.length > 0) {
    var arg = args.shift();
    var m = void 0;
    if ((m = arg.match(/^([a-zA-Z_][a-zA-Z0-9_-]*)=(.*)$/)) !== null) {
        var _m = m,
            _m2 = (0, _slicedToArray3.default)(_m, 3),
            key = _m2[1],
            val = _m2[2];

        if (val.match(/[^\\],/)) {
            val = val.replace(/\\,/g, "\uE000").split(/,/).map(function (val) {
                return convertValue(val.replace(/\uE000/g, ","));
            });
        } else val = convertValue(val.replace(/\\,/g, ","));
        pluginOpts[key] = val;
    } else pluginArgs.push(convertValue(arg));
}

/*
 *  STEP 5: Pass-through execution to Gemstone API
 */

gemstone.exec.apply(gemstone, [pluginName, pluginOpts].concat(pluginArgs)).then(function (output) {
    process.stdout.write(output);
    process.exit(0);
}).catch(function (err) {
    process.stderr.write("gemstone: ERROR: " + err.stack + "\n");
    process.exit(1);
});
