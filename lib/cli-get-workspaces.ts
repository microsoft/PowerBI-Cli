import * as powerbi from 'powerbi-api';
import * as msrest from 'ms-rest';
import {Cli as cli} from './cli';
import {Config as config} from './config';

export module CliGetWorkspaces {
    let err;
    let program = require('commander');
    let colors = require('colors');
    let pkg = require('../package.json');
    let util = require('util');

    program.version(pkg.version)
        .option('-c, --collection <collection>', 'The Power BI workspace collection')
        .option('-k, --accessKey <accessKey>', 'The Power BI workspace collection access key')
        .option('-b --baseUri [baseUri]', 'The base uri to connect to');

    program.on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ powerbi list-workspaces -c MyWorkspace -k ABC123');
    });

    program.parse(process.argv);
    let settings = config.merge(program);

    if (!(settings.collection && settings.accessKey)) {
        program.help();
    } else {
        try {
            let token = powerbi.PowerBIToken.createProvisionToken(settings.collection);
            let credentials = new msrest.TokenCredentials(token.generate(settings.accessKey), 'AppToken');
            let client = new powerbi.PowerBIClient(credentials, settings.baseUri, null);

            client.workspaces.getWorkspacesByCollectionName(settings.collection, (err, result) => {
                if (err) {
                    cli.error(err.message);
                } else {
                    let workspaces = result.value;

                    for (let i = 0; i < workspaces.length; i++) {
                        cli.print(workspaces[i].workspaceId);
                    }
                }
            });
        } catch (_error) {
            err = _error;
            cli.error(err);
        }
    }
}