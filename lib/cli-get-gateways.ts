import * as powerbi from 'powerbi-api';
import * as msrest from 'ms-rest';
import {Cli as cli} from './cli';
import {Config as config} from './config';
import * as program from 'commander';

export default function CliGetgateways() {
    let pkg = require('../package.json');

    program.version(pkg.version)
        .option('-c, --collection <collection>', 'The Power BI workspace collection')
        .option('-k, --accessKey <accessKey>', 'The Power BI workspace collection access key')
        .option('-w --workspaceId [workspaceId]', 'The Power BI workspace id')
		.option('-b --baseUri [baseUri]', 'The base uri to connect to');

    program.on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ powerbi get-gateways -c <collection> -k <accessKey>')
		console.log('    $ powerbi get-gateways -c <collection> -k <accessKey> -w [workspaceId]');
    });

    program.parse(process.argv);
    let settings = config.merge(program);

    if (!(settings.collection && settings.accessKey)) {
        program.help();
    } else {
        try {
            let credentials = new msrest.TokenCredentials(settings.accessKey, 'AppKey');
            let client = new powerbi.PowerBIClient(credentials, settings.baseUri, null);

            if(settings.workspaceId){
				client.gateways.getWorkspaceGateways(settings.collection, settings.workspaceId, (err, result) => {
					if (err) {
						return cli.error(err);
					}
					
					let gateways = result.value;

					if (gateways.length == 0) {
						return cli.warn('No gateways found within collection: %s', settings.collection);
					}

					cli.print("================================================");
					cli.print('Getting gateways for Collection: %s', settings.collection);
					cli.print("================================================");

					result.value.forEach(gateway => {
						cli.print(gateway.name, gateway.id);
					});
				});
			}
			else{
				client.gateways.getCollectionGateways(settings.collection, (err, result) => {
					if (err) {
						return cli.error(err);
					}
					
					let gateways = result.value;

					if (gateways.length == 0) {
						return cli.warn('No gateways found within collection: %s', settings.collection);
					}

					cli.print("================================================");
					cli.print('Gettings gateways for Collection: %s', settings.collection);
					cli.print("================================================");

					result.value.forEach(gateway => {
						cli.print(gateway.name, gateway.id);
					});
				});
			}
        } catch (err) {
            cli.error(err);
        }
    }
}