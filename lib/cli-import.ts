import * as powerbi from 'powerbi-api';
import * as msrest from 'ms-rest';
import {Cli as cli} from './cli';
import {Config as config} from './config';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as program from 'commander';

export default function CliImport() {
    let pkg = require('../package.json');
    let util = require('util');

    program.version(pkg.version)
        .option('-c, --collection <collection>', 'The Power BI workspace collection')
        .option('-w, --workspace <workspaceId>', 'The Power BI workspace')
        .option('-k, --accessKey <accessKey>', 'The Power BI workspace collection access key')
        .option('-n, --displayName <displayName>', 'The dataset display name')
        .option('-f, --file <file>', 'The PBIX file to upload')
        .option('-o, --overwrite [overwrite]', 'Whether to overwrite a dataset with the same name.  Default is false')
        .option('-b --baseUri [baseUri]', 'The base uri to connect to');

    program.on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ powerbi import -c <collection> -k <accessKey> -w <workspace> -f <file> -n <displayName>');
    });

    program.parse(process.argv);
    let settings = config.merge(program);

    if (process.argv.length === 2) {
        program.help();
    } else {
        try {
            let options: powerbi.ImportFileOptions = {};
            let credentials = new msrest.TokenCredentials(settings.accessKey, 'AppKey');
            let client = new powerbi.PowerBIClient(credentials, settings.baseUri, null);

            if (!_.isUndefined(settings.overwrite) && settings.overwrite) {
                options.nameConflict = 'Overwrite';
            }

            options.datasetDisplayName = settings.displayName;

            if (!fs.existsSync(settings.file)) {
                throw new Error(util.format('File "%s" not found', settings.file));
            }

            cli.print('Importing %s to workspace: %s', settings.file, settings.workspace);

            client.imports.uploadFile(settings.collection, settings.workspace, settings.file, options, (err, result, request, response) => {
                if (err) {
                    return cli.error(err);
                }

                let importResult: powerbi.ImportModel = result;

                cli.print('File uploaded successfully');
                cli.print('Import ID: %s', importResult.id);

                checkImportState(client, importResult, (importStateErr, importStateResult) => {
                    if (importStateErr) {
                        return cli.print(importStateErr);
                    }

                    cli.print('Import succeeded');
                });
            });
        } catch (err) {
            cli.error(err);
        }
    }

    /**
     * Checks the import state of the requested import id
     */
    function checkImportState(client: powerbi.PowerBIClient, importResult: powerbi.ImportModel, callback) {
        client.imports.getImportById(settings.collection, settings.workspace, importResult.id, (err, result) => {
            importResult = result;
            cli.print('Checking import state: %s', importResult.importState);

            if (importResult.importState === 'Succeeded' || importResult.importState === 'Failed') {
                callback(null, importResult);
            } else {
                setTimeout(() => {
                    checkImportState(client, importResult, callback);
                }, 500);
            }
        });
    }
}
