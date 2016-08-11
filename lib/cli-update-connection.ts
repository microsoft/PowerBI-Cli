import * as powerbi from 'powerbi-api';
import * as msrest from 'ms-rest';
import * as fs from 'fs';
import {Cli as cli} from './cli';
import {Config as config} from './config';
import * as program from 'commander';

export default function CliUpdateConnection() {
    let pkg = require('../package.json');

    program.version(pkg.version)
        .option('-c, --collection <collection>', 'The Power BI workspace collection')
        .option('-w, --workspace <workspaceId>', 'The Power BI workspace')
        .option('-k, --accessKey <accessKey>', 'The Power BI workspace collection access key')
        .option('-d, --dataset <datasetId>', 'The dataset to update')
        .option('-s, --connectionString [connectionString]', 'The connection string to access the datasource')
        .option('-u, --username [username]', 'The username to access the datasource')
        .option('-p, --password [password]', 'The password to access the datasource')
        .option('-b --baseUri [baseUri]', 'The base uri to connect to');

    program.on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ powerbi update-connection -c <collection> -k <accessKey> -w <workspace> -u [username] -p [password] -s [connectionString]');
    });

    program.parse(process.argv);
    let settings = config.merge(program);

    if (process.argv.length === 2 || !settings.dataset) {
        program.help();
    } else {
        try {
            let credentials = new msrest.TokenCredentials(settings.accessKey, 'AppKey');
            let client = new powerbi.PowerBIClient(credentials, settings.baseUri, null);

            client.datasets.getDatasetById(settings.collection, settings.workspace, settings.dataset, (getDatasetError, result) => {
                if (getDatasetError) {
                    return cli.error(getDatasetError);
                }

                cli.success('Found dataset!');
                cli.print('Id: %s', result.id);
                cli.print('Name: %s', result.name);

                if (settings.connectionString) {
                    updateConnectionString(client, settings, function (updateConnectionStringError) {
                        if (updateConnectionStringError) {
                            return cli.error(updateConnectionStringError);
                        }
                    });
                }

                if (settings.username && settings.password) {
                    updateCredentials(client, settings, function (updateCredentialsError) {
                        if (updateCredentialsError) {
                            return cli.error(updateCredentialsError);
                        }
                    });
                }
            });
        } catch (err) {
            cli.error(err);
        }
    }

    function updateConnectionString(client: powerbi.PowerBIClient, settings: any, callback: (err: Error, result?: any) => void): void {
        let params: { [propertyName: string]: any } = {
            connectionString: settings.connectionString
        };

        cli.print('Updating connection string...');
        client.datasets.setAllConnections(settings.collection, settings.workspace, settings.dataset, params, (err, result) => {
            if (err) {
                callback(err);
            }

            cli.success('Connection string successfully updated');
            cli.print('Dataset: ', settings.dataset);
            cli.print('ConnectionString: ', settings.connectionString);

            callback(null, result);
        });
    }

    function updateCredentials(client: powerbi.PowerBIClient, settings: any, callback: (err: Error, result?: any) => void): void {
        cli.print('Getting gateway datasources...');
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

            cli.print('Updating datasource credentials...');
            client.gateways.patchDatasource(settings.collection, settings.workspace, datasource.gatewayId, datasource.id, delta, (err, patchResult) => {
                if (err) {
                    return callback(err);
                }

                cli.success('Successfully updated datasource credentials!');
                cli.print('Datasource ID: ', datasource.id);
                cli.print('Gateway ID: ', datasource.gatewayId);

                callback(null, datasource);
            })
        });
    }
}
