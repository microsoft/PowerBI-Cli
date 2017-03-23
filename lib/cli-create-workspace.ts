import * as powerbi from 'powerbi-api';
import * as msrest from 'ms-rest';
import {Cli as cli} from './cli';
import {Config as config} from './config';
import * as program from 'commander';


export default function CliCreateWorkspace() {
    let pkg = require('../package.json');

    program.version(pkg.version)
        .option('-c, --collection <collection>', 'The Power BI workspace collection')
        .option('-k, --accessKey <accessKey>', 'The Power BI workspace collection access key')
        .option('-b --baseUri [baseUri]', 'The base uri to connect to')
        .option('-n --newName [newName]', 'The name of the workspace');

    program.on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ powerbi create-workspace -c <collection> -k <accessKey> -n <newName>');
    });

    program.parse(process.argv);

    let settings = config.merge(program);

    if (!(settings.collection && settings.accessKey)) {
        program.help();
    } else {
        try {
            let credentials = new msrest.TokenCredentials(settings.accessKey, 'AppKey');
            let client = new powerbi.PowerBIClient(credentials, settings.baseUri, null);
            let workspaceRequest : powerbi.CreateWorkspaceRequest = {
                name: settings.newName,
            };
            let options = { workspaceRequest }

            client.workspaces.postWorkspace(settings.collection, options, (err, result) => {
                if (err) {
                    return cli.error(err);
                }

                cli.print('Workspace created: %s', result.workspaceId);
            });
        } catch (err) {
            cli.error(err);
        }
    }
}