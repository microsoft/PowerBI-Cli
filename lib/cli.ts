let colors = require('colors');
let pkg = require("../package.json");
let _ = require('lodash');

const defaults: any = { color: 'white' };

export class Cli {
    public static print(message: string, options?: any): void {
        Cli.write(message, _.merge({}, defaults, options, { color: 'cyan' }));
    }

    public static warn(message: string, options?: any): void {
        Cli.write(message, _.merge({}, defaults, options, { color: 'yellow' }));
    }

    public static error(message: string, options?: any): void {
        Cli.write(message, _.merge({}, defaults, options, { color: 'red' }));
    }

    private static write(message, options?: any): void {
        if (message && typeof message === 'string') {
            return console.log("[", "powerbi"["white"], "]", message.toString()[options.color]);
        } else {
            throw new Error('no message defined to print!');
        }
    }

}