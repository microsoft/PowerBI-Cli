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
        .option('-d, --dataset <datasetId>', 'The dataset to update')
        .option('-cs, --connectionString [connectionString]', 'The connection string to access the datasource')
        .option('-u, --username [username]', 'The username to access the datasource')
        .option('-p, --password [password]', 'The password to access the datasource')
        .option('-b --baseUri [baseUri]', 'The base uri to connect to');

    program.on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ powerbi update-connection -c <collection> -k <accessKey> -w <workspace> -u [username] -p [password] -cs [connectionString]');
    });

    program.parse(process.argv);
    let settings = config.merge(program);

    if (process.argv.length === 2) {
        program.help();
    } else {
        try {
            let token = powerbi.PowerBIToken.createDevToken(settings.collection, settings.workspace);
            let credentials = new msrest.TokenCredentials(token.generate(settings.accessKey), 'AppToken');
            let client = new powerbi.PowerBIClient(credentials, settings.baseUri, null);

            client.datasets.getDatasetById(settings.collection, settings.workspace, settings.dataset, (err, result) => {
                if (err) {
                    return cli.error(err);
                }

                cli.success('Found dataset!');
                cli.print('Id: %s', result.id);
                cli.print('Name: %s', result.name);

                if (settings.connectionString) {
                    updateConnectionString(client, settings);
                }

                if (settings.username && settings.password) {
                    updateCredentials(client, settings)
                }
            });
        } catch (err) {
            cli.error(err);
        }
    }

    function updateConnectionString(client: powerbi.PowerBIClient, settings: any, callback?): void {
        let params: { [propertyName: string]: any } = {
            connectionString: settings.connectionString
        };

        client.datasets.setAllConnections(settings.collection, settings.workspace, settings.dataset, params, (err, result) => {
            if (err) {
                cli.error('Error updating connection string');
                cli.error(err);
                return;
            }

            cli.success('Connection string successfully updated');
            cli.print('Dataset: ', settings.dataset);
            cli.print('ConnectionString: ', settings.connectionString);

            if (callback) {
                callback(null, result);
            }
        });
    }

    function updateCredentials(client: powerbi.PowerBIClient, settings: any, callback?): void {
        client.datasets.getGatewayDatasources(settings.collection, settings.workspace, settings.dataset, (err, result) => {
            if (err) {
                return callback(err);
            }

            let datasources = result.value;

            if (datasources.length === 0) {
                return cli.warn('No datasources found within dataset: %s', settings.dataset);
            }

            if (datasources.length > 0) {
                cli.success('Found %s Datasources for Dataset %s', datasources.length, settings.dataset);
                cli.print('--------------------------------------------------------------------');
            }

            datasources.forEach(datasource => {
                cli.print('Datesource ID: ', datasource.id);
                cli.print('Gateway ID: ', datasource.gatewayId);
                cli.print('Credential Type: ', datasource.credentialType);
                cli.print('Datasource Type: ', datasource.datasourceType);
            });

            let datasource = datasources[0];

            if (datasources.length > 1) {
                cli.warn('Found multiple datasources, using datasource "%s" by default', datasource.id);
            }

            let credentials: powerbi.BasicCredentials = {
                username: settings.username,
                password: settings.password
            };

            let delta: powerbi.GatewayDatasource = {
                credentialType: 'Basic',
                basicCredentials: credentials
            };

            client.gateways.patchDatasource(settings.collection, settings.workspace, datasource.gatewayId, datasource.id, delta, (err, patchResult) => {
                if (err) {
                    return callback(err);
                }

                cli.success('Successfully updated datasource credentials!');
                cli.print('Datasource ID: ', datasource.id);
                cli.print('Gateway ID: ', datasource.gatewayId);

                if (callback) {
                    callback(null, datasource);
                }
            })
        });
    }
}