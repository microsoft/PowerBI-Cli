let colors = require('colors');
let pkg = require("../package.json");
let _ = require('lodash');
let util = require('util');

const defaults: any = { color: 'white' };

export class Cli {
    public static print(message: string, ...args: any[]): void {
        var params = Array.prototype.slice.call(arguments, 1);
        Cli.write(arguments[0], params, { color: 'cyan' });
    }

    public static warn(message: string, ...args: any[]): void {
        var params = Array.prototype.slice.call(arguments, 1);
        Cli.write(arguments[0], params, { color: 'yellow' });
    }

    public static error(message: string, ...args: any[]): void {
        var params = Array.prototype.slice.call(arguments, 1);
        Cli.write(arguments[0], params, { color: 'red' });
    }

    private static write(message: string, args: any[], options): void {
        if (typeof message === 'string') {
            var allArgs = [message];
            args.forEach(a => allArgs.push(a));
            var finalMessage = util.format.apply(null, allArgs);

            return console.log('[ powerbi ]'['white'], finalMessage[options.color]);
        } else {
            throw new Error('no message defined to print!');
        }
    }

}