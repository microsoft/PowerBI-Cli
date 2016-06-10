let pkg = require("../package.json");
let _ = require('lodash');
let util = require('util');
import * as msrest from 'ms-rest';
import * as colors from 'colors';

const defaults: any = { color: 'white' };

export class Cli {
    public static print(message: string, ...args: any[]): void {
        var params = Array.prototype.slice.call(arguments, 1);
        Cli.write(arguments[0], params, { color: 'cyan' });
    }

    public static success(message: string, ...args: any[]): void {
        var params = Array.prototype.slice.call(arguments, 1);
        Cli.write(arguments[0], params, { color: 'green' });
    }

    public static warn(message: string, ...args: any[]): void {
        var params = Array.prototype.slice.call(arguments, 1);
        Cli.write(arguments[0], params, { color: 'yellow' });
    }

    public static error(error: Error | msrest.ServiceError): void;
    public static error(message: string, ...args: any[]): void;

    public static error(): void {
        var err: Error = arguments[0];
        if (typeof err === 'object') {
            if (err.message) {
                Cli.error(err.message);
            }
            var serviceError: msrest.ServiceError = <msrest.ServiceError>err;
            if (serviceError.request) {
                Cli.error('Method: ', serviceError.request['method']);
                Cli.error('Url: ', serviceError.request['url']);
            }
            if (serviceError.statusCode) {
                Cli.error('Status Code: ', serviceError.statusCode)
            }
            if (serviceError.response && serviceError.response.headers) {
                for (var key in serviceError.response.headers) {
                    Cli.error(key, ': ', serviceError.response.headers[key]);
                }
            }

            return;
        }

        var params = Array.prototype.slice.call(arguments, 1);
        Cli.write(arguments[0], params, { color: 'red' });
    }

    private static write(message: string, args: any[], options): void {
        if (typeof message === 'string') {
            var allArgs = [message];
            args.forEach(a => allArgs.push(a));
            var finalMessage = util.format.apply(null, allArgs);

            return console.log('[', colors.yellow('powerbi'), ']', finalMessage[options.color]);
        } else {
            throw new Error('no message defined to print!');
        }
    }

}