import * as powerbi from 'powerbi-api';
import * as msrest from 'ms-rest';
import {Cli as cli} from './cli';
import {Config as config} from './config';

export module CliGetDatasets {
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
        console.log('    $ powerbi list-workspaces -c MyWorkspace -k ABC123');
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

            client.datasets.getDatasets(settings.collection, settings.workspace, (err, result) => {
                if (err) {
                    cli.error(err.message);
                } else {
                    let datasets = result.value;

                    if (datasets.length === 0) {
                        return cli.warn('No datasets found within workspace: %s', settings.workspace);
                    }

                    cli.print('=========================================');
                    cli.print('Gettings datasets for Collection: %s', settings.workspace);
                    cli.print('=========================================');

                    datasets.forEach(dataset => {
                        cli.print('ID: %s | Name: %s', dataset.id, dataset.name);
                    });
                }
            });
        } catch (_error) {
            err = _error;
            cli.error(err.message);
        }
    }
}