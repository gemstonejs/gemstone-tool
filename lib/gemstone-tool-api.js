"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Gemstone = undefined;

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("mz/fs");

var _fs2 = _interopRequireDefault(_fs);

var _latching = require("latching");

var _latching2 = _interopRequireDefault(_latching);

var _ducky = require("ducky");

var _ducky2 = _interopRequireDefault(_ducky);

var _installedPackages = require("installed-packages");

var _installedPackages2 = _interopRequireDefault(_installedPackages);

var _micromatch = require("micromatch");

var _micromatch2 = _interopRequireDefault(_micromatch);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _cliTable = require("cli-table2");

var _cliTable2 = _interopRequireDefault(_cliTable);

var _windowSize = require("window-size");

var _windowSize2 = _interopRequireDefault(_windowSize);

var _requireRelative = require("require-relative");

var _requireRelative2 = _interopRequireDefault(_requireRelative);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
**  GemstoneJS -- Gemstone JavaScript Technology Stack
**  Copyright (c) 2016-2017 Gemstone Project <http://gemstonejs.com>
**  Licensed under Apache License 2.0 <https://spdx.org/licenses/Apache-2.0>
*/

var commandHelp = {
    name: "help",
    desc: "Display details about available Gemstone commands",
    opts: [],
    args: [],
    func: function () {
        var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
            var _this = this;

            var pjson, out, widthsSpread;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            pjson = require(_path2.default.join(__dirname, "..", "package.json"));
                            out = _chalk2.default.bold("Gemstone Tool " + pjson.version + "\n");

                            out += "Copyright (c) 2016-2017 Ralf S. Engelschall <rse@engelschall.com>\n";
                            out += "Licensed under Apache License 2.0 <https://spdx.org/licenses/Apache-2.0>\n";
                            out += "\n";

                            out += "Requested plugin packages: " + _chalk2.default.blue(this.packagesUsed.join(", ")) + "\n";
                            out += "Loaded    plugin packages: ";
                            if (this.packagesLoaded.length === 0) out += _chalk2.default.grey("none") + "\n";else out += _chalk2.default.blue(this.packagesLoaded.join(", ")) + "\n";
                            out += "\n";

                            widthsSpread = function widthsSpread(widths) {
                                var widthMax = _windowSize2.default.width - 1;
                                var total = 0;
                                for (var i = 0; i < widths.length; i++) {
                                    widths[i] = Math.floor(widthMax / 100 * widths[i]) - 1;
                                    total += widths[i] + 1;
                                }
                                if (total < widthMax) widths[widths.length - 1] += widthMax - total;
                                return widths;
                            };

                            (0, _keys2.default)(this.commands).sort().forEach(function (cmd) {
                                var hasOpts = (0, _keys2.default)(_this.commands[cmd].opts).length > 0;
                                var hasArgs = _this.commands[cmd].args.length > 0;

                                var table = new _cliTable2.default({
                                    head: [_chalk2.default.reset.bold("COMMAND"), _chalk2.default.reset.bold("DESCRIPTION")],
                                    colWidths: widthsSpread([20, 80]),
                                    style: {
                                        "padding-left": 1,
                                        "padding-right": 1,
                                        border: ["grey"],
                                        compact: true
                                    },
                                    chars: {
                                        "top-left": "┌",
                                        "top": "─",
                                        "top-mid": "┬",
                                        "top-right": "┐",

                                        "left": "│",
                                        "left-mid": "",
                                        "middle": "│",
                                        "mid-mid": "",
                                        "mid": "",
                                        "right": "│",
                                        "right-mid": "",

                                        "bottom-left": hasOpts || hasArgs ? "├" : "└",
                                        "bottom": "─",
                                        "bottom-mid": "┴",
                                        "bottom-right": hasOpts || hasArgs ? "┤" : "┘"
                                    }
                                });
                                table.push([_chalk2.default.green(cmd), _chalk2.default.green(_this.commands[cmd].desc)]);
                                out += table.toString() + "\n";

                                if ((0, _keys2.default)(_this.commands[cmd].opts).length > 0) {
                                    table = new _cliTable2.default({
                                        head: [_chalk2.default.reset.bold("OPTION"), _chalk2.default.reset.bold("TYPE"), _chalk2.default.reset.bold("DEFAULT"), _chalk2.default.reset.bold("DESCRIPTION")],
                                        colWidths: widthsSpread([20, 20, 20, 40]),
                                        style: {
                                            "padding-left": 1,
                                            "padding-right": 1,
                                            border: ["grey"],
                                            compact: true
                                        },
                                        chars: {
                                            "top-left": "",
                                            "top": "",
                                            "top-mid": "",
                                            "top-right": "",

                                            "left": "│",
                                            "left-mid": "",
                                            "middle": "│",
                                            "mid-mid": "",
                                            "mid": "",
                                            "right": "│",
                                            "right-mid": "",

                                            "bottom-left": hasArgs ? "├" : "└",
                                            "bottom": "─",
                                            "bottom-mid": "┴",
                                            "bottom-right": hasArgs ? "┤" : "┘"
                                        }
                                    });
                                    (0, _keys2.default)(_this.commands[cmd].opts).forEach(function (name) {
                                        var opt = _this.commands[cmd].opts[name];
                                        table.push([_chalk2.default.blue(opt.name), opt.type, (0, _stringify2.default)(opt.def), opt.desc]);
                                    });
                                    out += table.toString() + "\n";
                                }

                                if (_this.commands[cmd].args.length > 0) {
                                    table = new _cliTable2.default({
                                        head: [_chalk2.default.reset.bold("ARGUMENT"), _chalk2.default.reset.bold("TYPE"), _chalk2.default.reset.bold("DESCRIPTION")],
                                        colWidths: widthsSpread([20, 39, 41]),
                                        style: {
                                            "padding-left": 1,
                                            "padding-right": 1,
                                            border: ["grey"],
                                            compact: true
                                        },
                                        chars: {
                                            "top-left": "",
                                            "top": "",
                                            "top-mid": "",
                                            "top-right": "",

                                            "left": "│",
                                            "left-mid": "",
                                            "middle": "│",
                                            "mid-mid": "",
                                            "mid": "",
                                            "right": "│",
                                            "right-mid": "",

                                            "bottom-left": "└",
                                            "bottom": "─",
                                            "bottom-mid": "┴",
                                            "bottom-right": "┘"
                                        }
                                    });
                                    _this.commands[cmd].args.forEach(function (arg) {
                                        table.push([_chalk2.default.blue(arg.name), arg.type, arg.desc]);
                                    });
                                    out += table.toString() + "\n";
                                }
                            });
                            return _context.abrupt("return", out);

                        case 12:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function func() {
            return _ref.apply(this, arguments);
        }

        return func;
    }()
};

var Gemstone = exports.Gemstone = function (_Latching) {
    (0, _inherits3.default)(Gemstone, _Latching);

    function Gemstone(_ref2) {
        var _ref2$verbose = _ref2.verbose,
            verbose = _ref2$verbose === undefined ? false : _ref2$verbose,
            _ref2$colored = _ref2.colored,
            colored = _ref2$colored === undefined ? true : _ref2$colored;
        (0, _classCallCheck3.default)(this, Gemstone);

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (Gemstone.__proto__ || (0, _getPrototypeOf2.default)(Gemstone)).call(this));

        _this2.verbose = verbose;
        _this2.colored = colored;
        _this2.packagesInstalled = null;
        _this2.packagesColocated = null;
        _this2.packagesLoaded = null;
        _this2.packagesUsed = [];
        _this2.commands = {};
        _this2.register(commandHelp);
        _this2.use("gemstone-tool-plugin-*!");
        _this2.use("gemstone-*-tool-plugin!");
        _this2.use("@gemstone-tool-plugin");
        return _this2;
    }

    (0, _createClass3.default)(Gemstone, [{
        key: "use",
        value: function use() {
            var _this3 = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            args.forEach(function (arg) {
                if (!((typeof arg === "undefined" ? "undefined" : (0, _typeof3.default)(arg)) === "object" && arg instanceof Array)) arg = [arg];
                var errors = [];
                if (!_ducky2.default.validate(arg, "[ string* ]", errors)) throw new Error("gemstone: ERROR: use: invalid argument(s): " + errors.join("; "));
                _this3.packagesUsed = _this3.packagesUsed.concat(arg);
            });
            return this;
        }
    }, {
        key: "register",
        value: function register(spec) {
            this.commands[spec.name] = spec;
            return this;
        }
    }, {
        key: "exec",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(name, opts) {
                var _this4 = this,
                    _commands$name$func;

                for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                    args[_key2 - 2] = arguments[_key2];
                }

                var stubLoc, dir, items, _i, stat, cmd, found, commands, _found, nameSegments, i, _spec, errors, _errors, spec, out;

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(this.packagesInstalled === null)) {
                                    _context2.next = 4;
                                    break;
                                }

                                _context2.next = 3;
                                return (0, _installedPackages2.default)();

                            case 3:
                                this.packagesInstalled = _context2.sent;

                            case 4:
                                if (!(this.packagesColocated === null)) {
                                    _context2.next = 31;
                                    break;
                                }

                                this.packagesColocated = [];
                                stubLoc = void 0;

                                try {
                                    stubLoc = require.resolve(_path2.default.join("gemstone", "package.json"));
                                } catch (ex) {/* NO-OP */}

                                if (!stubLoc) {
                                    _context2.next = 31;
                                    break;
                                }

                                stubLoc = _path2.default.dirname(stubLoc);
                                dir = _path2.default.join(stubLoc, "node_modules");
                                _context2.next = 13;
                                return _fs2.default.stat(dir);

                            case 13:
                                if (_context2.sent.isDirectory()) {
                                    _context2.next = 15;
                                    break;
                                }

                                dir = _path2.default.resolve(_path2.default.join(stubLoc, ".."));

                            case 15:
                                _context2.next = 17;
                                return _fs2.default.readdir(dir);

                            case 17:
                                items = _context2.sent;
                                _i = 0;

                            case 19:
                                if (!(_i < items.length)) {
                                    _context2.next = 31;
                                    break;
                                }

                                _context2.next = 22;
                                return _fs2.default.stat(_path2.default.join(dir, items[_i]));

                            case 22:
                                stat = _context2.sent;

                                if (!stat.isDirectory()) {
                                    _context2.next = 28;
                                    break;
                                }

                                _context2.next = 26;
                                return _fs2.default.stat(_path2.default.join(dir, items[_i], "package.json")).catch(function () {
                                    return null;
                                });

                            case 26:
                                stat = _context2.sent;

                                if (stat !== null && stat.isFile()) this.packagesColocated.push(_path2.default.join(dir, items[_i]));

                            case 28:
                                _i++;
                                _context2.next = 19;
                                break;

                            case 31:

                                /*  deferred loading of requested plugins  */
                                if (this.packagesLoaded === null) {
                                    this.packagesLoaded = [];
                                    this.packagesUsed.forEach(function (used) {
                                        var _used$match = used.match(/^(@)?(.+?)(!)?$/),
                                            _used$match2 = (0, _slicedToArray3.default)(_used$match, 4),
                                            keyword = _used$match2[1],
                                            pattern = _used$match2[2],
                                            optional = _used$match2[3];

                                        var found = false;

                                        /*  check standard installation locations  */
                                        var plugins = void 0;
                                        if (keyword) plugins = _this4.packagesInstalled.filter(function (name) {
                                            var pjson = void 0;
                                            try {
                                                pjson = (0, _requireRelative2.default)(_path2.default.join(name, "package.json"), process.cwd());
                                            } catch (ex) {/* NO-OP */}
                                            if (pjson === undefined) {
                                                try {
                                                    pjson = require(_path2.default.join(name, "package.json"));
                                                } catch (ex) {/* NO-OP */}
                                            }
                                            return (typeof pjson === "undefined" ? "undefined" : (0, _typeof3.default)(pjson)) === "object" && pjson !== null && (0, _typeof3.default)(pjson.keywords) === "object" && pjson.keywords instanceof Array && pjson.keywords.indexOf(pattern) >= 0;
                                        });else plugins = (0, _micromatch2.default)(_this4.packagesInstalled, pattern, { nodupes: true });
                                        if (plugins.length > 0) {
                                            found = true;
                                            plugins.forEach(function (plugin) {
                                                var obj = (0, _requireRelative2.default)(plugin, process.cwd());
                                                obj.call(_this4, _this4);
                                                _this4.packagesLoaded.push(plugin);
                                            });
                                        }

                                        /*  check Gemstone colocations  */
                                        if (keyword) plugins = _this4.packagesColocated.filter(function (name) {
                                            var pjson = void 0;
                                            try {
                                                pjson = require(_path2.default.join(name, "package.json"));
                                            } catch (ex) {/* NO-OP */}
                                            return (typeof pjson === "undefined" ? "undefined" : (0, _typeof3.default)(pjson)) === "object" && pjson !== null && (0, _typeof3.default)(pjson.keywords) === "object" && pjson.keywords instanceof Array && pjson.keywords.indexOf(pattern) >= 0;
                                        });else {
                                            plugins = _this4.packagesColocated.filter(function (name) {
                                                var basename = _path2.default.basename(name);
                                                return _micromatch2.default.isMatch(basename, pattern, { nodupes: true });
                                            });
                                        }
                                        if (plugins.length > 0) {
                                            found = true;
                                            plugins.forEach(function (plugin) {
                                                var obj = require(plugin);
                                                obj.call(_this4, _this4);
                                                _this4.packagesLoaded.push(plugin);
                                            });
                                        }

                                        /*  final sanity check  */
                                        if (!found && !optional) throw new Error("gemstone: ERROR: exec: no plugin package found for \"" + used + "\"");
                                    });
                                }

                                /*  sanity check command  */
                                cmd = this.commands[name];

                                if (cmd === undefined) {
                                    /*  alias matching  */
                                    found = (0, _keys2.default)(this.commands).filter(function (command) {
                                        return (0, _typeof3.default)(_this4.commands[command].alias) === "object" && _this4.commands[command].alias instanceof Array && _this4.commands[command].alias.indexOf(name) >= 0;
                                    });

                                    if (found.length === 1) {
                                        name = found[0];
                                        cmd = this.commands[name];
                                    }
                                }
                                if (cmd === undefined) {
                                    /*  fuzzy matching: prefix matching  */
                                    commands = (0, _keys2.default)(this.commands);
                                    _found = commands.filter(function (command) {
                                        return command.startsWith(name);
                                    });

                                    if (_found.length !== 1) {
                                        /*  fuzzy matching: segment matching  */
                                        nameSegments = name.split(/-/);

                                        _found = commands.filter(function (command) {
                                            var commandSegments = command.split(/-/);
                                            var match = false;
                                            if (nameSegments.length === commandSegments.length) {
                                                var _i2 = void 0;
                                                for (_i2 = 0; _i2 < commandSegments.length; _i2++) {
                                                    if (!commandSegments[_i2].startsWith(nameSegments[_i2])) break;
                                                }if (_i2 === commandSegments.length) match = true;
                                            }
                                            return match;
                                        });
                                    }
                                    if (_found.length === 1) {
                                        name = _found[0];
                                        cmd = this.commands[name];
                                    }
                                }

                                if (!(cmd === undefined)) {
                                    _context2.next = 37;
                                    break;
                                }

                                throw new Error("no such command \"" + name + "\" registered");

                            case 37:

                                /*  sanity check options  */
                                (0, _keys2.default)(opts).forEach(function (optName) {
                                    var opt = cmd.opts.find(function (opt) {
                                        return opt.name === optName;
                                    });
                                    if (opt === undefined) throw new Error("gemstone: ERROR: exec: " + ("unknown option \"" + optName + "\" on command \"" + name + "\""));
                                    if (opt.type.match(/^\[.*\]$/) && !((0, _typeof3.default)(opts[optName]) === "object" && opts[optName] instanceof Array)) opts[optName] = [opts[optName]];
                                    var errors = [];
                                    if (!_ducky2.default.validate(opts[optName], opt.type, errors)) throw new Error("gemstone: ERROR: exec: " + ("invalid type \"" + (0, _typeof3.default)(opts[optName]) + "\" for value of option \"" + optName + "\" ") + ("on command \"" + name + "\": " + errors.join("; ")));
                                });
                                cmd.opts.forEach(function (opt) {
                                    if (opts[opt.name] === undefined) {
                                        if (opt.def !== undefined) opts[opt.name] = opt.def;else throw new Error("gemstone: ERROR: exec: " + ("missing mandatory option \"" + opt.name + "\" on command \"" + name + "\""));
                                    }
                                });

                                /*  sanity check arguments  */
                                i = void 0;
                                i = 0;

                            case 41:
                                if (!(i < args.length)) {
                                    _context2.next = 59;
                                    break;
                                }

                                _spec = cmd.args[i];

                                if (!(_spec === undefined)) {
                                    _context2.next = 45;
                                    break;
                                }

                                throw new Error("gemstone: ERROR: exec: too many arguments on command \"" + name + "\"");

                            case 45:
                                if (!_spec.type.match(/^\[.*\]$/)) {
                                    _context2.next = 53;
                                    break;
                                }

                                errors = [];

                                if (_ducky2.default.validate(args.slice(i), _spec.type, errors)) {
                                    _context2.next = 49;
                                    break;
                                }

                                throw new Error("gemstone: ERROR: exec: " + ("invalid arguments #" + i + "+ on command \"" + name + "\": " + errors.join("; ")));

                            case 49:
                                i = args.length;
                                return _context2.abrupt("break", 59);

                            case 53:
                                _errors = [];

                                if (_ducky2.default.validate(args[i], _spec.type, _errors)) {
                                    _context2.next = 56;
                                    break;
                                }

                                throw new Error("gemstone: ERROR: exec: " + ("invalid argument #" + i + " on command \"" + name + "\": " + _errors.join("; ")));

                            case 56:
                                i++;
                                _context2.next = 41;
                                break;

                            case 59:
                                spec = cmd.args[i];

                                if (!(spec !== undefined)) {
                                    _context2.next = 62;
                                    break;
                                }

                                throw new Error("gemstone: ERROR: exec: too less arguments on command \"" + name + "\"");

                            case 62:
                                _context2.next = 64;
                                return (_commands$name$func = this.commands[name].func).call.apply(_commands$name$func, [this, opts].concat(args));

                            case 64:
                                out = _context2.sent;

                                if (!(typeof out !== "string")) {
                                    _context2.next = 67;
                                    break;
                                }

                                throw new Error("gemstone: ERROR: exec: invalid result type on command \"" + name + "\" (expected string type)");

                            case 67:

                                /*  post-process output  */
                                if (!this.colored) out = _chalk2.default.stripColor(out);
                                return _context2.abrupt("return", out);

                            case 69:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function exec(_x, _x2) {
                return _ref3.apply(this, arguments);
            }

            return exec;
        }()
    }]);
    return Gemstone;
}(_latching2.default);

module.exports = Gemstone;
