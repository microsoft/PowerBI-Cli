import * as powerbi from 'powerbi-api';
import * as msrest from 'ms-rest';
import {Cli as cli} from './cli';
import {Config as config} from './config';
import * as program from 'commander';

export default function CliCloneReprot() {
    let pkg = require('../package.json');

    program.version(pkg.version)
        .option('-c, --collection <collection>', 'The Power BI workspace collection')
        .option('-w, --workspace <workspace>', 'The Power BI workspace')
        .option('-r, --report <reportKey>', 'The report to clone')
        .option('-k, --accessKey <accessKey>', 'The Power BI workspace collection access key')
        .option('-n, --newName <newName>', 'The new report name')
        .option('-t, --tworkspace [targetWorkspace]', 'New target workspace to save report in. default is original report workspace')
        .option('-d, --tdataset [targetDatasetKey]', 'New target dataset to rebind report with. default is original report dataset')
        .option('-b --baseUri [baseUri]', 'The base uri to connect to');

    program.on('--help', function () {
        console.log('  Description:');
        console.log('');
        console.log('    Clones a report to a new report with new name.');
        console.log('    Assign target workspace to save the new report in a specific workspace.');
        console.log('    Assign target dataset to rebind the new report with a specific dataset.');
        console.log('');
        console.log('  Examples:');
        console.log('');
        console.log('    $ powerbi clone-reports -c <collection> -w <workspace> -k <accessKey> -r <report> -n <newName>');
    });

    program.parse(process.argv);

    let settings = config.merge(program);

    if (!(settings.collection && settings.accessKey && settings.workspace && settings.report && settings.newName)) {
        program.help();
    }

    try {
        let credentials = new msrest.TokenCredentials(settings.accessKey, 'AppKey');
        let client = new powerbi.PowerBIClient(credentials, settings.baseUri, null);

        let params: powerbi.CloneReportRequest = {
            name: settings.newName,
            targetWorkspaceId: settings.tworkspace,
            targetModelId: settings.tdataset
        };

        client.reports.cloneReport(settings.collection, settings.workspace, settings.report, params, (err, result) => {
            if (err) {
                return cli.error(err);
            }
            
            cli.success('Clone report has been completed successfully');
        });
    } catch (err) {
        cli.error(err);
    }
}