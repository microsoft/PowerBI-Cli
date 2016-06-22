import * as powerbi from 'powerbi-api';
import * as msrest from 'ms-rest';
import * as fs from 'fs';
import {Cli as cli} from './cli';
import {Config as config} from './config';
import * as program from 'commander';

export default function CliConfig() {
    let pkg = require('../package.json');

    program.version(pkg.version)
        .option('-c, --collection [collection]', 'The Power BI workspace collection')
        .option('-w, --workspace [workspaceId]', 'The Power BI workspace')
        .option('-k, --accessKey [accessKey]', 'The Power BI workspace collection access key')
        .option('-b, --baseUri [baseUri]', 'The base uri to connect to')
        .option('-r, --report [reportId]', 'The Power BI report id')
        .option('-clear, --clear [clear]', 'Clears the settings');

    program.on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ powerbi config -c <collection> -k <accessKey> -w <workspace> -b <baseUri> -r <reportId>');
    });

    program.parse(process.argv);

    try {
        let properties = ['collection', 'workspace', 'accessKey', 'baseUri', 'reportId'];
        let currentConfig = config.get();
        
        properties.forEach(key => {
            if (program[key]) {
                currentConfig[key] = program[key];
            }
        });

        config.set(currentConfig);
        
        for (var key in currentConfig) {
            cli.print('%s: %s', key, currentConfig[key]);
        }
    } catch (err) {
        cli.error(err);
    }
}