import * as powerbi from 'powerbi-api';
import * as msrest from 'ms-rest';
import {Cli as cli} from './cli';
import {Config as config} from './config';
import * as program from 'commander';

export default function CliCreateEmbedToken() {
    let pkg = require('../package.json');

    function list(val) {
        return val.split(',');
    }

    program.version(pkg.version)
        .option('-c, --collection <collection>', 'The Power BI workspace collection')
        .option('-k, --accessKey <accessKey>', 'The Power BI workspace collection access key')
        .option('-w, --workspace <workspaceId>', 'The Power BI workspace id')
        .option('-r, --report <reportId>', 'The Power BI report id')
        .option('-d, --dataset <datasetId>', 'The Power BI dataset id')
        .option('-s, --scopes [scopes]', 'The permission scopes allowed')
        .option('-u, --username [username]', 'The RLS username')
        .option('--roles [roles]', 'The RLS roles', list);

    program.on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ powerbi create-embed-token -c <collection>, -w <workspace> -r <reportId> -k <accessKey> -u [username] --roles [roles1,roles2,...]');
        console.log('    $ powerbi create-embed-token -c <collection>, -w <workspace> -d <datasetId> -k <accessKey>');
        console.log('    $ powerbi create-embed-token -c <collection>, -w <workspace> -r <reportId> -k <accessKey> -s [scopes]');
    });

    program.parse(process.argv);

    let settings = config.merge(program);

    if (!(settings.collection && settings.accessKey)) {
        program.help();
    } else {
        try {
            let token: powerbi.PowerBIToken = null;

            if (!settings.accessKey) {
                return cli.error('Access key param is required');
            }

            if (!(settings.collection && settings.workspace)) {
                return cli.error('collection and workspace params are required');
            }

            if (!(settings.report || settings.dataset)) {
                return cli.error('Either reportId or datasetId must be set');
            }
            token = powerbi.PowerBIToken.createReportEmbedToken(settings.collection, settings.workspace, settings.report, settings.dataset, settings.scopes, settings.username, settings.roles);

            let jwt = token.generate(settings.accessKey);
            cli.success('Embed Token: ', jwt);

        } catch (err) {
            cli.error(err);
        }
    }
}