import * as powerbi from 'powerbi-api';
import * as msrest from 'ms-rest';
import {Cli as cli} from './cli';
import {Config as config} from './config';
import * as program from 'commander';

export default function CliGetDatasets() {
    let pkg = require('../package.json');

    program.version(pkg.version)
        .option('-c, --collection <collection>', 'The Power BI workspace collection')
        .option('-w, --workspace <workspace>', 'The Power BI workspace')
        .option('-k, --accessKey <accessKey>', 'The Power BI workspace collection access key')
        .option('-b --baseUri [baseUri]', 'The base uri to connect to');

    program.on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ powerbi get-datasets -c <collection> -w <workspace> -k <accessKey>');
    });

    program.parse(process.argv);

    let settings = config.merge(program);

    if (!(settings.collection && settings.accessKey && settings.workspace)) {
        program.help();
    } else {
        try {
            let credentials = new msrest.TokenCredentials(settings.accessKey, 'AppKey');        
            let client = new powerbi.PowerBIClient(credentials, settings.baseUri, null);

            client.datasets.getDatasets(settings.collection, settings.workspace, (err, result) => {
                if (err) {
                    return cli.error(err);
                }
                
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
            });
        } catch (err) {
            cli.error(err);
        }
    }
}