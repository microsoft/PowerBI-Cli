/// <reference path="../typings/main.d.ts" />

import {Cli} from './cli';
import {CliConfig} from './cli-config';
import {CliCreateWorkspace} from './cli-create-workspace';
import {CliGetWorkspaces} from './cli-Get-workspaces';
import {CliImport} from './cli-import';
import {CliGetDatasets} from './cli-get-datasets';
import {CliGetReports} from './cli-get-reports';
import {CliUpdateConnection} from './cli-update-connection';
import {CliDeleteDataset} from './cli-delete-dataset';

export module Main {
    let program = require('commander');
    let colors = require('colors');
    let err;
    let pkg = require('../package.json');

    program.version(pkg.version)
        .command('config', 'Set default configuration values')
        .command('get-workspaces', 'Gets a list of workspaces within an existing workspace collection')
        .command('create-workspace', 'Create a new workspace within an existing workspace collection')
        .command('import', 'Import a PBIX file to a workspace')
        .command('get-datasets', 'Gets a list of datasets within a workspace')
        .command('get-reports', 'Gets a list of reports within a workspace')
        .command('update-connection', 'Update the connection string for a datasource')
        .command('delete-dataset', 'Deletes a dataset from a workspace');        

    program.on('--help', function () {
        console.log('See help on sub commands');
        console.log('');
        console.log('    $ powerbi <command> --help');
    });

    program.parse(process.argv);

    if (process.argv.length === 2) {
        program.help();
    }
}