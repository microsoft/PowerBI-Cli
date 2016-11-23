import * as powerbi from 'powerbi-api';
import * as msrest from 'ms-rest';
import {Cli as cli} from './cli';
import {Config as config} from './config';
import * as program from 'commander';

class WorkspaceId implements powerbi.WorkspaceId{
    id?: string;
    
    constructor(id: string) {
        this.id = id;
    }
}

class CreateGatewayRequest implements powerbi.CreateGatewayRequest{
    name?: string;
    publicKey?: string;
    annotation?: string;
    workspaces?: WorkspaceId[];

    constructor(name: string, publicKey: string, workspace: WorkspaceId) {
        this.name = name;
        this.publicKey = publicKey;
        this.workspaces = [workspace]; 
    }
}

export default function CliGetgatewayById() {
    let pkg = require('../package.json');

    program.version(pkg.version)
        .option('-c, --collection <collection>', 'The Power BI workspace collection')
        .option('-k, --accessKey <accessKey>', 'The Power BI workspace collection access key')
        .option('-n --gatewayName <gatewayName>', 'The Power BI gateway name to create')
		.option('-p --gatewayPublicKey <gatewayPublicKey>', 'The Power BI gateway public key to create')
		.option('-w --gatewayWorkspace <gatewayWorkspace>', 'The Power BI workspace id to add gateway')
		.option('-b --baseUri [baseUri]', 'The base uri to connect to');

    program.on('--help', function () {
        console.log('  Examples:');
        console.log('');
		console.log('    $ powerbi create-gateway -c <collection> -k <accessKey> -n <gatewayName> -p <gatewayPublicKey> -w <gatewayWorkspace>');
    });

    program.parse(process.argv);
    let settings = config.merge(program);

    if (!(settings.collection && settings.accessKey && settings.gatewayName && settings.gatewayPublicKey && settings.gatewayWorkspace)) {
        program.help();
    } else {
        try {
            let credentials = new msrest.TokenCredentials(settings.accessKey, 'AppKey');
            let client = new powerbi.PowerBIClient(credentials, settings.baseUri, null);
			let requestBody = new CreateGatewayRequest(settings.gatewayName, settings.gatewayPublicKey, new WorkspaceId(settings.gatewayWorkspace));

			client.gateways.postGateway(settings.collection, requestBody, (err, result) => {
				if (err) {
					return cli.error(err);
				}

				cli.print("================================================");
				cli.print('Creating gateway: %s', settings.gatewayName);
				cli.print("================================================");
				cli.print(result.value);
			});
        } catch (err) {
            cli.error(err);
        }
    }
}