import * as powerbi from 'powerbi-api';
import * as msrest from 'ms-rest';
import {Cli as cli} from './cli';
import {Config as config} from './config';
import * as program from 'commander';

export default function CliRebindReport() {
    let pkg = require('../package.json');

    program.version(pkg.version)
        .option('-c, --collection <collection>', 'The Power BI workspace collection')
        .option('-w, --workspace <workspace>', 'The Power BI workspace Id')
        .option('-k, --accessKey <accessKey>', 'The Power BI workspace collection access key')
        .option('-r, --report <reportId>', 'The Power BI report id')
        .option('-d, --dataset <datasetId>', 'The Power BI dataset id')
        .option('-b --baseUri [baseUri]', 'The base uri to connect to');

    program.on('--help', function () {
        console.log('  Description:');
        console.log('');
        console.log('    Rebinds a report with another dataset. Old dataset and new dataset should have the same schema.');
        console.log('');
        console.log('  Examples:');
        console.log('');
        console.log('    $ powerbi rebind-reports -c <collection> -w <workspace> -k <accessKey>');
    });

    program.parse(process.argv);

    let settings = config.merge(program);

    if (!(settings.collection && settings.workspace && settings.accessKey && settings.report && settings.dataset)) {
        program.help();
        return;
    }

    try {
        let credentials = new msrest.TokenCredentials(settings.accessKey, 'AppKey');
        let client = new powerbi.PowerBIClient(credentials, settings.baseUri, null);

        let params: powerbi.RebindReportRequest = { datasetId: settings.dataset };

        client.reports.rebindReport(settings.collection, settings.workspace, settings.report, params, (err, result) => {
            if (err) {
                return cli.error(err);
            }

            cli.success('Rebind report has been completed successfully');
        });
    } catch (err) {
        cli.error(err);
    }
}