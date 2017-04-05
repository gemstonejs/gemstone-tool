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

import path              from "path"
import Latching          from "latching"
import Ducky             from "ducky"
import installedPackages from "installed-packages"
import micromatch        from "micromatch"
import chalk             from "chalk"
import Table             from "cli-table2"
import windowsize        from "window-size"
import requireRelative   from "require-relative"

const commandHelp = {
    name: "help",
    desc: "Display details about available Gemstone commands",
    opts: [],
    args: [],
    func: async function (/* opts, ...args */) {
        const pjson = require(path.join(__dirname, "..", "package.json"))
        let out = chalk.bold(`Gemstone Tool ${pjson.version}\n`)
        out += "Copyright (c) 2016-2017 Ralf S. Engelschall <rse@engelschall.com>\n"
        out += "Distributed under MIT license.\n"
        out += "\n"

        out += `Requested plugin packages: ${chalk.blue(this.packagesUsed.join(", "))}\n`
        out += "Loaded    plugin packages: "
        if (this.packagesLoaded.length === 0)
            out += `${chalk.grey("none")}\n`
        else
            out += `${chalk.blue(this.packagesLoaded.join(", "))}\n`
        out += "\n"

        /* eslint no-console: 0 */
        const widthsSpread = (widths) => {
            let widthMax = windowsize.width - 1
            let total = 0
            for (let i = 0; i < widths.length; i++) {
                widths[i] = Math.floor((widthMax / 100) * widths[i]) - 1
                total += widths[i] + 1
            }
            if (total < widthMax)
                widths[widths.length - 1] += (widthMax - total)
            return widths
        }

        Object.keys(this.commands).sort().forEach((cmd) => {
            let hasOpts = (Object.keys(this.commands[cmd].opts).length > 0)
            let hasArgs = (this.commands[cmd].args.length > 0)

            let table = new Table({
                head: [
                    chalk.reset.bold("COMMAND"),
                    chalk.reset.bold("DESCRIPTION")
                ],
                colWidths: widthsSpread([ 20, 80 ]),
                style: {
                    "padding-left":  1,
                    "padding-right": 1,
                    border: [ "grey" ],
                    compact: true
                },
                chars: {
                    "top-left":     "┌",
                    "top":          "─",
                    "top-mid":      "┬",
                    "top-right":    "┐",

                    "left":         "│",
                    "left-mid":     "",
                    "middle":       "│",
                    "mid-mid":      "",
                    "mid":          "",
                    "right":        "│",
                    "right-mid":    "",

                    "bottom-left":  (hasOpts || hasArgs ? "├" : "└"),
                    "bottom":       "─",
                    "bottom-mid":   "┴",
                    "bottom-right": (hasOpts || hasArgs ? "┤" : "┘")
                }
            })
            table.push([ chalk.green(cmd), chalk.green(this.commands[cmd].desc) ])
            out += table.toString() + "\n"

            if (Object.keys(this.commands[cmd].opts).length > 0) {
                table = new Table({
                    head: [
                        chalk.reset.bold("OPTION"),
                        chalk.reset.bold("TYPE"),
                        chalk.reset.bold("DEFAULT"),
                        chalk.reset.bold("DESCRIPTION")
                    ],
                    colWidths: widthsSpread([ 20, 20, 20, 40 ]),
                    style: {
                        "padding-left":  1,
                        "padding-right": 1,
                        border: [ "grey" ],
                        compact: true
                    },
                    chars: {
                        "top-left":     "",
                        "top":          "",
                        "top-mid":      "",
                        "top-right":    "",

                        "left":         "│",
                        "left-mid":     "",
                        "middle":       "│",
                        "mid-mid":      "",
                        "mid":          "",
                        "right":        "│",
                        "right-mid":    "",

                        "bottom-left":  (hasArgs ? "├" : "└"),
                        "bottom":       "─",
                        "bottom-mid":   "┴",
                        "bottom-right": (hasArgs ? "┤" : "┘")
                    }
                })
                Object.keys(this.commands[cmd].opts).forEach((name) => {
                    let opt = this.commands[cmd].opts[name]
                    table.push([ chalk.blue(opt.name), opt.type, JSON.stringify(opt.def), opt.desc ])
                })
                out += table.toString() + "\n"
            }

            if (this.commands[cmd].args.length > 0) {
                table = new Table({
                    head: [
                        chalk.reset.bold("ARGUMENT"),
                        chalk.reset.bold("TYPE"),
                        chalk.reset.bold("DESCRIPTION")
                    ],
                    colWidths: widthsSpread([ 20, 39, 41 ]),
                    style: {
                        "padding-left":  1,
                        "padding-right": 1,
                        border: [ "grey" ],
                        compact: true
                    },
                    chars: {
                        "top-left":     "",
                        "top":          "",
                        "top-mid":      "",
                        "top-right":    "",

                        "left":         "│",
                        "left-mid":     "",
                        "middle":       "│",
                        "mid-mid":      "",
                        "mid":          "",
                        "right":        "│",
                        "right-mid":    "",

                        "bottom-left":  "└",
                        "bottom":       "─",
                        "bottom-mid":   "┴",
                        "bottom-right": "┘"
                    }
                })
                this.commands[cmd].args.forEach((arg) => {
                    table.push([ chalk.blue(arg.name), arg.type, arg.desc ])
                })
                out += table.toString() + "\n"
            }
        })
        return out
    }
}

export class Gemstone extends Latching {
    constructor ({ verbose = false, colored = true }) {
        super()
        this.verbose           = verbose
        this.colored           = colored
        this.packagesInstalled = null
        this.packagesLoaded    = null
        this.packagesUsed      = []
        this.commands          = {}
        this.register(commandHelp)
        this.use("gemstone-tool-plugin-*!")
        this.use("gemstone-*-tool-plugin!")
        this.use("@gemstone-tool-plugin")
    }
    use (...args) {
        args.forEach((arg) => {
            if (!(typeof arg === "object" && arg instanceof Array))
                arg = [ arg ]
            let errors = []
            if (!Ducky.validate(arg, "[ string* ]", errors))
                throw new Error(`gemstone: ERROR: use: invalid argument(s): ${errors.join("; ")}`)
            this.packagesUsed = this.packagesUsed.concat(arg)
        })
        return this
    }
    register (spec) {
        this.commands[spec.name] = spec
        return this
    }
    async exec (name, opts, ...args) {
        /*  deferred determination of installed packages  */
        if (this.packagesInstalled === null)
            this.packagesInstalled = await installedPackages()

        /*  deferred loading of requested plugins  */
        if (this.packagesLoaded === null) {
            this.packagesLoaded = []
            this.packagesUsed.forEach((used) => {
                let [ , keyword, pattern, optional ] = used.match(/^(@)?(.+?)(!)?$/)
                let plugins
                if (keyword)
                    plugins = this.packagesInstalled.filter((name) => {
                        let pjson
                        try { pjson = requireRelative(`${name}/package.json`, process.cwd()) }
                        catch (ex) { /* NO-OP */ }
                        return (
                               typeof pjson === "object"
                            && pjson !== null
                            && typeof pjson.keywords === "object"
                            && pjson.keywords instanceof Array
                            && pjson.keywords.indexOf(pattern) >= 0
                        )
                    })
                else
                    plugins = micromatch(this.packagesInstalled, pattern, { nodupes: true })
                if (plugins.length === 0 && !optional)
                    throw new Error(`gemstone: ERROR: exec: no plugin package found for "${pattern}"`)
                plugins.forEach((plugin) => {
                    let obj = requireRelative(plugin, process.cwd())
                    obj.call(this, this)
                    this.packagesLoaded.push(plugin)
                })
            })
        }

        /*  sanity check command  */
        let cmd = this.commands[name]
        if (cmd === undefined)
            throw new Error(`no such command "${name}" registered`)

        /*  sanity check options  */
        Object.keys(opts).forEach((optName) => {
            let opt = cmd.opts.find((opt) => opt.name === optName)
            if (opt === undefined)
                throw new Error("gemstone: ERROR: exec: " +
                    `unknown option "${optName}" on command "${name}"`)
            if (opt.type.match(/^\[.*\]$/) && !(typeof opts[optName] === "object" && opts[optName] instanceof Array))
                opts[optName] = [ opts[optName] ]
            let errors = []
            if (!Ducky.validate(opts[optName], opt.type, errors))
                throw new Error("gemstone: ERROR: exec: " +
                    `invalid type "${typeof opts[optName]}" for value of option "${optName}" ` +
                    `on command "${name}": ${errors.join("; ")}`)
        })
        cmd.opts.forEach((opt) => {
            if (opts[opt.name] === undefined) {
                if (opt.def !== undefined)
                    opts[opt.name] = opt.def
                else
                    throw new Error("gemstone: ERROR: exec: " +
                        `missing mandatory option "${opt.name}" on command "${name}"`)
            }
        })

        /*  sanity check arguments  */
        let i
        for (i = 0; i < args.length; i++) {
            let spec = cmd.args[i]
            if (spec === undefined)
                throw new Error(`gemstone: ERROR: exec: too many arguments on command "${name}"`)
            if (spec.type.match(/^\[.*\]$/)) {
                let errors = []
                if (!Ducky.validate(args.slice(i), spec.type, errors))
                    throw new Error("gemstone: ERROR: exec: " +
                        `invalid arguments #${i}+ on command "${name}": ${errors.join("; ")}`)
                i = args.length
                break
            }
            else {
                let errors = []
                if (!Ducky.validate(args[i], spec.type, errors))
                    throw new Error("gemstone: ERROR: exec: " +
                        `invalid argument #${i} on command "${name}": ${errors.join("; ")}`)
            }
        }
        let spec = cmd.args[i]
        if (spec !== undefined)
            throw new Error(`gemstone: ERROR: exec: too less arguments on command "${name}"`)

        /*  execute command  */
        let out = await this.commands[name].func.call(this, opts, ...args)
        if (typeof out !== "string")
            throw new Error(`gemstone: ERROR: exec: invalid result type on command "${name}" (expected string type)`)

        /*  post-process output  */
        if (!this.colored)
            out = chalk.stripColor(out)
        return out
    }
}

module.exports = Gemstone

