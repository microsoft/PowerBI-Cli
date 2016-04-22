import * as powerbi from 'powerbi-api';
import * as msrest from 'ms-rest';
import {Cli as cli} from './cli';
import {Config as config} from './config';

export default function CliGetReports() {
    let err;
    let program = require('commander');
    let colors = require('colors');
    let pkg = require('../package.json');
    let util = require('util');

    program.version(pkg.version)
        .option('-c, --collection <collection>', 'The Power BI workspace collection')
        .option('-w, --workspace <workspace>', 'The Power BI workspace')
        .option('-k, --accessKey <accessKey>', 'The Power BI workspace collection access key')
        .option('-b --baseUri [baseUri]', 'The base uri to connect to');

    program.on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ powerbi get-reports -c <collection> -w <workspace> -k <accessKey>');
    });

    program.parse(process.argv);

    let settings = config.merge(program);

    if (!(settings.collection && settings.accessKey && settings.workspace)) {
        program.help();
    } else {
        try {
            let token = powerbi.PowerBIToken.createDevToken(settings.collection, settings.workspace);
            let credentials = new msrest.TokenCredentials(token.generate(settings.accessKey), 'AppToken');
            let client = new powerbi.PowerBIClient(credentials, settings.baseUri, null);

            client.reports.getReports(settings.collection, settings.workspace, (err, result) => {
                if (err) {
                    return cli.error(err);
                }
                
                let reports = result.value;

                if (reports.length === 0) {
                    return cli.warn('No reports found within workspace: %s', settings.workspace);
                }

                cli.print('=========================================');
                cli.print('Gettings reports for Collection: %s', settings.workspace);
                cli.print('=========================================');

                reports.forEach(report => {
                    cli.print('ID: %s | Name: %s', report.id, report.name);
                });
            });
        } catch (err) {
            cli.error(err);
        }
    }
}