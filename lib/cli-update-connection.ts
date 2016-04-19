import * as powerbi from 'powerbi-api';
import * as msrest from 'ms-rest';
import * as fs from 'fs';
import {Cli as cli} from './cli';
import {Config as config} from './config';

export module CliUpdateConnection {
    let err;
    let program = require('commander');
    let colors = require('colors');
    let pkg = require('../package.json');
    let util = require('util');

    program.version(pkg.version)
        .option('-c, --collection <collection>', 'The Power BI workspace collection')
        .option('-w, --workspace <workspaceId>', 'The Power BI workspace')
        .option('-k, --accessKey <accessKey>', 'The Power BI workspace collection access key')
        .option('-d, --datasetId <datasetId>', 'The dataset to update')
        .option('-cs, --connectionString [connectionString]', 'The connection string to access the datasource')
        .option('-u, --username [username]', 'The username to access the datasource')
        .option('-p, --password [password]', 'The password to access the datasource')
        .option('-b --baseUri [baseUri]', 'The base uri to connect to');

    program.on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ powerbi update-connection -c MyWorkspace -k ABC123 -w ABC123 -u username -p password -cs connectionString');
    });

    program.parse(process.argv);

    if (process.argv.length === 2) {
        program.help();
    } else {
        try {
            let settings = config.merge(program);
            let token = powerbi.PowerBIToken.createDevToken(settings.collection, settings.workspace);
            let credentials = new msrest.TokenCredentials(token.generate(settings.accessKey), 'AppToken');
            let client = new powerbi.PowerBIClient(credentials, settings.baseUri, null);

            client.datasets.getDatasetById(settings.collection, settings.workspace, settings.datasetId, (err, result) => {
                if (err) {
                    return cli.error(err.message);
                }

                cli.print('Found dataset!');
                cli.print('Id: %s', result.id);
                cli.print('Name: %s', result.name);

                if (result.datasources.length > 0) {
                    cli.print('==============================');
                    cli.print('Datasources');
                    cli.print('==============================');
                }

                result.datasources.forEach(datasource => {
                    cli.print('Name: %s', datasource.name);
                    cli.print('Connection String: %s', datasource.connectionString);
                });
            });

        } catch (err) {
            cli.error(err);
        }
    }
}