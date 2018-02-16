#!/usr/bin/env node
"use strict";

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
**  GemstoneJS -- Gemstone JavaScript Technology Stack
**  Copyright (c) 2016-2018 Gemstone Project <http://gemstonejs.com>
**  Licensed under Apache License 2.0 <https://spdx.org/licenses/Apache-2.0>
*/

const options = [{ names: ["help", "h"], type: "bool", "default": false,
    help: "Print tool usage and exit." }, { names: ["version"], type: "bool", "default": false,
    help: "Print tool version and exit." }, { names: ["verbose", "v"], env: "GEMTOOL_VERBOSE", type: "bool", "default": false,
    help: "Enable verbosity in outputs." }, { names: ["color", "c"], env: "GEMTOOL_COLOR", type: "bool", "default": _chalk2.default.supportsColor,
    help: "Enable colors in outputs." }, { names: ["plugins", "p"], type: "string", "default": "",
    help: "Plugins to load.", helpArg: "NAME[,...]" }];
const parser = _dashdash2.default.createParser({
    options: options,
    interspersed: false
});
let opts;
try {
    opts = parser.parse(process.argv);
} catch (ex) {
    process.stderr.write(`gemstone: ERROR: ${ex.message}\n`);
    process.exit(1);
}

/*
 *  STEP 2: Execute global options
 */

if (opts.help) {
    let help = parser.help().trimRight();
    process.stdout.write("gemstone: USAGE: gemstone [options] command [arguments]\n" + "options:\n" + help + "\n");
    process.exit(0);
} else if (opts.version) {
    process.stdout.write(`${_package2.default.name} ${_package2.default.version}\n`);
    process.exit(0);
}

/*
 *  STEP 3: Load API and the requested plugins
 */

let gemstone = new _gemstoneToolApi2.default({
    verbose: opts.verbose,
    color: opts.color
});
if (opts.plugins !== "") {
    let plugins = opts.plugins.split(/,/);
    gemstone.use(plugins);
}

/*
 *  STEP 4: Parse command-line arguments
 */

let args = opts._args;

if (args.length === 0) args = ["help"];

let pluginName = args.shift();
let pluginOpts = {};
let pluginArgs = [];

const convertValue = val => {
    if (val.match(/^(?:true|false)$/)) val = val === "true";else if (val.match(/^[+-]?[0-9]+$/)) val = parseInt(val, 10);else if (val.match(/^[+-]?[0-9]*\.?[0-9]+(?:[eE][+-]?[0-9]+)?$/)) val = parseFloat(val);
    return val;
};

while (args.length > 0) {
    let arg = args.shift();
    let m;
    if ((m = arg.match(/^([a-zA-Z_][a-zA-Z0-9_-]*)=(.*)$/)) !== null) {
        let [, key, val] = m;
        if (val.match(/[^\\],/)) {
            val = val.replace(/\\,/g, "\uE000").split(/,/).map(val => convertValue(val.replace(/\uE000/g, ",")));
        } else val = convertValue(val.replace(/\\,/g, ","));
        pluginOpts[key] = val;
    } else pluginArgs.push(convertValue(arg));
}

/*
 *  STEP 5: Pass-through execution to Gemstone API
 */

gemstone.exec(pluginName, pluginOpts, ...pluginArgs).then(output => {
    process.stdout.write(output);
    process.exit(0);
}).catch(err => {
    process.stderr.write(`gemstone: ERROR: ${err.stack}\n`);
    process.exit(1);
});
