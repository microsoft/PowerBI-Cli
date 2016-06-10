import * as powerbi from 'powerbi-api';
import * as msrest from 'ms-rest';
import {Cli as cli} from './cli';
import {Config as config} from './config';
import * as program from 'commander';

export default function CliCreateToken() {
    let pkg = require('../package.json');

    program.version(pkg.version)
        .option('-c, --collection <collection>', 'The Power BI workspace collection')
        .option('-k, --accessKey <accessKey>', 'The Power BI workspace collection access key')
        .option('-t, --tokenType <tokenType>', 'The type of token to generate')
        .option('-w, --workspace [workspaceId]', 'The Power BI workspace id')
        .option('-r, --report [reportId]', 'The Power BI report id');

    program.on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ powerbi create-token -c <collection>, -w <workspace> -r <reportId> -k <accessKey>');
    });

    program.parse(process.argv);

    let settings = config.merge(program);

    if (!(settings.collection && settings.accessKey)) {
        program.help();
    } else {
        try {
            let tokenType: string = null;
            let token: powerbi.PowerBIToken = null;

            if (!settings.tokenType) {
                return cli.error('tokenType param is required');
            }

            if (!settings.accessKey) {
                return cli.error('Access key param is required');
            }

            switch (settings.tokenType.toLowerCase()) {
                case 'embed':
                    if (!(settings.collection && settings.workspace && settings.report)) {
                        return cli.error('collection, workspace and report params are required');
                    }
                    token = powerbi.PowerBIToken.createReportEmbedToken(settings.collection, settings.workspace, settings.report);
                    break;
                case 'dev':
                    if (!(settings.collection && settings.workspace)) {
                        return cli.error('collection & workspace params are required');
                    }
                    token = powerbi.PowerBIToken.createDevToken(settings.collection, settings.workspace);
                    break;
                case 'provision':
                    if (!(settings.collection)) {
                        return cli.error('collection param is required');
                    }
                    token = powerbi.PowerBIToken.createProvisionToken(settings.collection);
                    break;
                default:
                    return cli.error('Unknown tokenType specified.  Options: provision, dev, embed');
            }

            let jwt = token.generate(settings.accessKey);
            cli.success('%s: ', settings.tokenType, jwt);

        } catch (err) {
            cli.error(err);
        }
    }
}
